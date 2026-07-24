export const SOUTH = 'south';
export const NORTH = 'north';
export const PLAYERS = [SOUTH, NORTH];

const OWN_PITS = {
  [SOUTH]: [0, 1, 2, 3, 4, 5],
  [NORTH]: [6, 7, 8, 9, 10, 11],
};

const OTHER = { [SOUTH]: NORTH, [NORTH]: SOUTH };
const TOTAL_SEEDS = 48;
const MAJORITY = 25;

export function otherPlayer(player) {
  return OTHER[player];
}

export function nextRoundStarter(game, previousFirstPlayer = SOUTH) {
  if (PLAYERS.includes(game?.winner)) return game.winner;
  // Em caso de empate, conserva-se a saída: volta a começar quem abriu
  // a partida empatada.
  return PLAYERS.includes(previousFirstPlayer) ? previousFirstPlayer : SOUTH;
}

export function playerPits(player) {
  return [...OWN_PITS[player]];
}

export function isOwnPit(player, pitIndex) {
  return OWN_PITS[player].includes(pitIndex);
}

export function createGame({ firstPlayer = SOUTH } = {}) {
  return {
    board: Array(12).fill(4),
    scores: { [SOUTH]: 0, [NORTH]: 0 },
    currentPlayer: firstPlayer,
    status: 'playing',
    winner: null,
    reason: '',
    turn: 1,
    lastMove: null,
    consecutivePasses: 0,
  };
}

export function cloneGame(game) {
  return {
    ...game,
    board: [...game.board],
    scores: { ...game.scores },
    lastMove: game.lastMove ? structuredCloneSafe(game.lastMove) : null,
  };
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

export function rowSeedCount(game, player) {
  return OWN_PITS[player].reduce((sum, index) => sum + game.board[index], 0);
}

function nextPit(index) {
  return (index + 1) % 12;
}

export function sowOnly(game, pitIndex) {
  const player = game.currentPlayer;
  if (!isOwnPit(player, pitIndex)) {
    throw new Error('A casa escolhida não pertence ao jogador activo.');
  }

  const board = [...game.board];
  let seeds = board[pitIndex];
  board[pitIndex] = 0;
  let cursor = pitIndex;

  while (seeds > 0) {
    cursor = nextPit(cursor);
    if (cursor === pitIndex) {
      cursor = nextPit(cursor);
    }
    board[cursor] += 1;
    seeds -= 1;
  }

  return { board, lastPit: cursor };
}

export function legalMoves(game) {
  if (game.status !== 'playing') return [];

  // Regra operacional do Uril de Cabo Verde: qualquer casa própria com
  // pelo menos uma semente é jogável. Não existe bloqueio por alimentação.
  return OWN_PITS[game.currentPlayer].filter((index) => game.board[index] > 0);
}

function captureFrom(board, player, lastPit) {
  const opponent = otherPlayer(player);
  const capturedPits = [];
  let capturedSeeds = 0;
  let cursor = lastPit;

  while (
    isOwnPit(opponent, cursor) &&
    (board[cursor] === 2 || board[cursor] === 3)
  ) {
    capturedPits.push(cursor);
    capturedSeeds += board[cursor];
    board[cursor] = 0;
    cursor = (cursor + 11) % 12;
  }

  return { capturedPits, capturedSeeds };
}

function collectRemainingSeeds(game, reason) {
  for (const player of PLAYERS) {
    const remaining = rowSeedCount(game, player);
    game.scores[player] += remaining;
    for (const index of OWN_PITS[player]) game.board[index] = 0;
  }
  finishGame(game, reason);
}

function finishGame(game, reason) {
  game.status = 'finished';
  game.reason = reason;
  if (game.scores[SOUTH] > game.scores[NORTH]) game.winner = SOUTH;
  else if (game.scores[NORTH] > game.scores[SOUTH]) game.winner = NORTH;
  else game.winner = 'draw';
}

function checkImmediateMajority(game) {
  if (game.scores[SOUTH] >= MAJORITY || game.scores[NORTH] >= MAJORITY) {
    finishGame(game, 'Maioria absoluta de sementes alcançada.');
    return true;
  }
  return false;
}

export function applyMove(game, pitIndex) {
  const next = cloneGame(game);
  const moves = legalMoves(next);
  if (!moves.includes(pitIndex)) {
    throw new Error('Jogada inválida segundo as regras do Uril de Cabo Verde.');
  }

  const player = next.currentPlayer;
  const opponent = otherPlayer(player);
  const before = [...next.board];
  const { board, lastPit } = sowOnly(next, pitIndex);
  next.board = board;

  const { capturedPits, capturedSeeds } = captureFrom(next.board, player, lastPit);
  next.scores[player] += capturedSeeds;

  const grandSlam =
    capturedSeeds > 0 && OWN_PITS[opponent].every((index) => next.board[index] === 0);

  next.lastMove = {
    player,
    pitIndex,
    before,
    after: [...next.board],
    lastPit,
    capturedPits,
    capturedSeeds,
    grandSlam,
  };
  next.turn += 1;

  if (checkImmediateMajority(next)) return next;

  // Depois da jogada, a vez passa sempre ao adversário, incluindo quando
  // foram colhidas as seis casas. Se o adversário ficar sem sementes para
  // jogar, a partida termina e cada lado recolhe o que resta na sua fila.
  next.currentPlayer = opponent;

  const opponentMoves = legalMoves(next);
  if (opponentMoves.length === 0) {
    collectRemainingSeeds(
      next,
      grandSlam
        ? 'Colheita das seis casas; o adversário ficou sem jogada.'
        : 'O adversário ficou sem sementes para jogar.',
    );
    return next;
  }

  if (next.turn > 500) {
    collectRemainingSeeds(next, 'Fim por limite de segurança de jogadas.');
  }

  return next;
}

export function createMatch() {
  return {
    quatros: { [SOUTH]: 0, [NORTH]: 0 },
    runOwner: null,
    runWins: 0,
    protectedBy: null,
    cutCandidate: null,
    cutWins: 0,
    gamesPlayed: 0,
    lastGameWinner: null,
    message: 'A contagem começa em 0–0.',
  };
}

export function cloneMatch(match) {
  return structuredCloneSafe(match);
}

export function registerGameResult(match, winner) {
  const next = cloneMatch(match);
  next.gamesPlayed += 1;
  next.lastGameWinner = winner;

  if (winner === 'draw' || !PLAYERS.includes(winner)) {
    next.message = 'Empate: a contagem mantém-se.';
    return next;
  }

  const opponent = otherPlayer(winner);

  if (next.protectedBy && winner !== next.protectedBy) {
    if (next.cutCandidate === winner) next.cutWins += 1;
    else {
      next.cutCandidate = winner;
      next.cutWins = 1;
    }

    if (next.cutWins >= 2) {
      next.protectedBy = null;
      next.runOwner = winner;
      next.runWins = 2;
      next.cutCandidate = null;
      next.cutWins = 0;
      next.message = `${labelPlayer(winner)} cortou a contagem com duas vitórias seguidas e lidera por 2–0.`;
    } else {
      next.message = `${labelPlayer(winner)} conseguiu a primeira vitória necessária para cortar a contagem. Falta mais uma consecutiva.`;
    }
    return next;
  }

  if (next.protectedBy === winner) {
    next.cutCandidate = null;
    next.cutWins = 0;
  }

  if (next.runOwner === winner) next.runWins += 1;
  else {
    next.runOwner = winner;
    next.runWins = 1;
  }

  if (next.runWins >= 4) {
    next.quatros[winner] += 1;
    next.protectedBy = winner;
    next.runOwner = null;
    next.runWins = 0;
    next.cutCandidate = null;
    next.cutWins = 0;
    next.message = `${labelPlayer(winner)} marcou um Quatro. O Quatro fica registado e só há corte com duas vitórias consecutivas do adversário.`;
  } else {
    next.message = `${labelPlayer(winner)} lidera a contagem actual por ${next.runWins}–0.`;
  }

  // Mantém a estrutura explícita, mesmo quando o adversário não tem contagem.
  void opponent;
  return next;
}

function labelPlayer(player) {
  return player === SOUTH ? 'Sul' : 'Norte';
}

export function matchDisplay(match) {
  const score = { [SOUTH]: 0, [NORTH]: 0 };
  if (match.runOwner) score[match.runOwner] = match.runWins;
  return {
    score,
    quatros: { ...match.quatros },
    protectedBy: match.protectedBy,
    cutCandidate: match.cutCandidate,
    cutWins: match.cutWins,
    message: match.message,
  };
}

export function validateGame(game) {
  const boardSeeds = game.board.reduce((sum, n) => sum + n, 0);
  const scored = game.scores[SOUTH] + game.scores[NORTH];
  return {
    valid: boardSeeds + scored === TOTAL_SEEDS,
    total: boardSeeds + scored,
    boardSeeds,
    scored,
  };
}

export function pitLabel(index) {
  if (index < 6) return `Sul ${index + 1}`;
  return `Norte ${index - 5}`;
}
