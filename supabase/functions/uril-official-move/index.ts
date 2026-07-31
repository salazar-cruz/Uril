import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  SOUTH,
  NORTH,
  applyMove,
  createGame,
  createMatch,
  gameResultValue,
  nextRoundStarter,
  registerGameResult,
  resignGame,
} from './engine.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createHistoryEntry(session: any, type = 'move', at = new Date().toISOString()) {
  return {
    type,
    at,
    game: clone(session.game),
    match: clone(session.match),
    firstPlayer: session.firstPlayer,
    previousWinner: session.previousWinner ?? null,
  };
}

function normaliseSession(raw: any) {
  const session = raw && typeof raw === 'object' ? clone(raw) : {};
  session.game ||= createGame({ firstPlayer: SOUTH });
  session.match ||= createMatch();
  session.firstPlayer ||= session.game.currentPlayer || SOUTH;
  session.previousWinner ??= null;
  session.roundRegistered = Boolean(session.roundRegistered);
  session.createdAt ||= new Date().toISOString();
  session.lastMoveAt ||= null;
  session.history = Array.isArray(session.history) ? session.history.slice(-40) : [];
  return session;
}

function settleRound(session: any) {
  if (session.game.status === 'finished' && !session.roundRegistered) {
    session.match = registerGameResult(
      session.match,
      session.game.winner,
      gameResultValue(session.game),
    );
    session.roundRegistered = true;
  }
  return session;
}

function playerSide(room: any, userId: string) {
  if (room.host_id === userId) return SOUTH;
  if (room.guest_id === userId) return NORTH;
  return null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Método inválido.' }, 405);

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = request.headers.get('Authorization') || '';

    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const service = createClient(url, serviceRole, { auth: { persistSession: false } });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return json({ error: 'A sessão de jogador não é válida.' }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const roomId = String(body.roomId || '');
    const action = String(body.action || 'move');
    const pitIndex = Number(body.pitIndex);
    if (!roomId) return json({ error: 'Banco de Uril inválido.' }, 400);

    const { data: room, error: roomError } = await service
      .from('uril_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    if (roomError || !room) return json({ error: 'Banco de Uril não encontrado.' }, 404);

    const guestRoom = room.room_kind === 'guest' || room.private_room === true;
    if (guestRoom) {
      if (!userData.user.is_anonymous || room.rated || !room.private_room) {
        return json({ error: 'Este banco privado destina-se a jogadores anónimos.' }, 403);
      }
    } else {
      if (userData.user.is_anonymous) {
        return json({ error: 'Só jogadores inscritos fazem jogadas oficiais.' }, 401);
      }
      const { data: playerProfile, error: profileError } = await service
        .from('uril_profiles')
        .select('id,calibration_games')
        .eq('id', userData.user.id)
        .maybeSingle();
      if (profileError || !playerProfile) {
        return json({ error: 'Perfil oficial de jogador inexistente.' }, 403);
      }
      if (Number(playerProfile.calibration_games || 0) < 3) {
        return json({ error: 'Conclui os três testes de calibração antes de jogares partidas oficiais.' }, 403);
      }
    }

    const side = playerSide(room, userData.user.id);
    if (!side) return json({ error: 'O jogador não pertence a esta partida.' }, 403);
    if (!['playing', 'interrupted'].includes(room.status)) {
      return json({ error: 'A partida oficial não está activa.' }, 409);
    }

    const beforeSession = normaliseSession(room.game_state);
    let nextSession = clone(beforeSession);
    const now = new Date().toISOString();
    let moveType = action;
    let moveRow: any = null;

    if (action === 'move') {
      if (!Number.isInteger(pitIndex) || pitIndex < 0 || pitIndex > 11) {
        return json({ error: 'Casa inválida.' }, 400);
      }
      if (nextSession.game.status !== 'playing') {
        return json({ error: 'A partida já terminou.' }, 409);
      }
      if (nextSession.game.currentPlayer !== side) {
        return json({ error: 'Não é a vez deste jogador.' }, 409);
      }

      const beforeGame = clone(nextSession.game);
      nextSession.game = applyMove(nextSession.game, pitIndex);
      nextSession = settleRound(nextSession);
      nextSession.lastMoveAt = now;
      nextSession.history.push(createHistoryEntry(nextSession, 'move', now));
      nextSession.history = nextSession.history.slice(-40);

      const lastMove = nextSession.game.lastMove || {};
      moveRow = {
        room_id: room.id,
        game_no: Math.max(1, Number(nextSession.match?.gamesPlayed || 0) + (nextSession.game.status === 'finished' ? 0 : 1)),
        ply: Number(beforeGame.turn || 1),
        actor_id: userData.user.id,
        player_side: side,
        pit_index: pitIndex,
        move_type: 'move',
        board_before: beforeGame.board,
        board_after: nextSession.game.board,
        scores_before: beforeGame.scores,
        scores_after: nextSession.game.scores,
        captured_pits: lastMove.capturedPits || [],
        captured_seeds: Number(lastMove.capturedSeeds || 0),
        fed_opponent: Boolean(lastMove.fedOpponent),
        grand_slam: Boolean(lastMove.grandSlam),
        frouxo: Boolean(lastMove.frouxo),
        game_status: nextSession.game.status,
        winner: nextSession.game.winner,
        created_at: now,
      };
    } else if (action === 'resign') {
      if (nextSession.game.status !== 'playing') return json({ error: 'A partida já terminou.' }, 409);
      const beforeGame = clone(nextSession.game);
      nextSession.game = resignGame(nextSession.game, side);
      nextSession = settleRound(nextSession);
      nextSession.lastMoveAt = now;
      nextSession.history.push(createHistoryEntry(nextSession, 'resignation', now));
      nextSession.history = nextSession.history.slice(-40);
      moveRow = {
        room_id: room.id,
        game_no: Math.max(1, Number(nextSession.match?.gamesPlayed || 1)),
        ply: Number(beforeGame.turn || 1),
        actor_id: userData.user.id,
        player_side: side,
        pit_index: null,
        move_type: 'resignation',
        board_before: beforeGame.board,
        board_after: nextSession.game.board,
        scores_before: beforeGame.scores,
        scores_after: nextSession.game.scores,
        game_status: 'finished',
        winner: nextSession.game.winner,
        created_at: now,
      };
    } else if (action === 'new_round') {
      if (nextSession.game.status !== 'finished') return json({ error: 'A partida actual ainda não terminou.' }, 409);
      const starter = nextRoundStarter(nextSession.game, nextSession.firstPlayer || SOUTH);
      const previousWinner = [SOUTH, NORTH].includes(nextSession.game.winner)
        ? nextSession.game.winner
        : null;
      nextSession.game = createGame({ firstPlayer: starter });
      nextSession.firstPlayer = starter;
      nextSession.previousWinner = previousWinner;
      nextSession.roundRegistered = false;
      nextSession.history.push(createHistoryEntry(nextSession, 'round-start', now));
      nextSession.history = nextSession.history.slice(-40);
      moveType = 'round-start';
      moveRow = {
        room_id: room.id,
        game_no: Number(nextSession.match?.gamesPlayed || 0) + 1,
        ply: 0,
        actor_id: userData.user.id,
        player_side: side,
        pit_index: null,
        move_type: 'round-start',
        board_before: null,
        board_after: nextSession.game.board,
        scores_before: null,
        scores_after: nextSession.game.scores,
        game_status: 'playing',
        winner: null,
        created_at: now,
      };
    } else {
      return json({ error: 'Acção oficial desconhecida.' }, 400);
    }

    const finishedRound = nextSession.game.status === 'finished';
    const currentQuatroTotal = Number(nextSession.match?.quatros?.[SOUTH] || 0)
      + Number(nextSession.match?.quatros?.[NORTH] || 0);
    const previousQuatroTotal = Number(beforeSession.match?.quatros?.[SOUTH] || 0)
      + Number(beforeSession.match?.quatros?.[NORTH] || 0);
    const updatePayload: any = {
      game_state: nextSession,
      status: 'playing',
      version: Number(room.version || 0) + 1,
      updated_at: now,
      last_move_at: action === 'new_round' ? room.last_move_at : now,
      started_at: room.started_at || now,
      last_host_seen_at: room.host_id === userData.user.id ? now : room.last_host_seen_at,
      last_guest_seen_at: room.guest_id === userData.user.id ? now : room.last_guest_seen_at,
      last_finish_reason: finishedRound ? String(nextSession.game.reason || '') : room.last_finish_reason,
      last_result_value: finishedRound ? gameResultValue(nextSession.game) : room.last_result_value,
      has_capote: Boolean(room.has_capote || (finishedRound && gameResultValue(nextSession.game) === 2)),
      has_frouxo: Boolean(room.has_frouxo || nextSession.game.lastMove?.frouxo || String(nextSession.game.reason || '').startsWith('Frouxo')),
      has_quatro: Boolean(room.has_quatro || currentQuatroTotal > previousQuatroTotal),
    };

    const { data: updatedRoom, error: updateError } = await service
      .from('uril_rooms')
      .update(updatePayload)
      .eq('id', room.id)
      .eq('version', room.version)
      .select('*')
      .single();
    if (updateError || !updatedRoom) {
      return json({ error: 'A posição foi alterada noutro dispositivo. Actualiza o banco.' }, 409);
    }

    let insertedMove = null;
    if (moveRow && !guestRoom) {
      const { data, error } = await service
        .from('uril_moves')
        .insert(moveRow)
        .select('*')
        .single();
      if (error && error.code !== '23505') throw error;
      insertedMove = data;
    }

    let rating = null;
    if (nextSession.game.status === 'finished' && updatedRoom.rated && updatedRoom.guest_id) {
      const gameNo = Number(nextSession.match?.gamesPlayed || 1);
      const { data, error } = await service.rpc('uril_finalize_rating', {
        p_room_id: room.id,
        p_game_no: gameNo,
        p_winner_side: nextSession.game.winner,
      });
      if (!error) rating = data;
    }

    return json({ room: updatedRoom, move: insertedMove, rating, action: moveType });
  } catch (error) {
    return json({ error: error?.message || 'Erro interno no servidor da partida.' }, 500);
  }
});
