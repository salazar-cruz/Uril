export const SOUTH = 'south';
export const NORTH = 'north';
export const PLAYERS = [SOUTH, NORTH];

const OWN_PITS = {
  [SOUTH]: [0, 1, 2, 3, 4, 5],
  [NORTH]: [6, 7, 8, 9, 10, 11],
};

const OTHER = { [SOUTH]: NORTH, [NORTH]: SOUTH };
const TOTAL_SEEDS = 48;
const CAPOTE_LIMIT = 12;
const REPETITION_LIMIT = 3;

export function otherPlayer(player) {
  return OTHER[player];
}

export function nextRoundStarter(game, previousFirstPlayer = SOUTH) {
  if (PLAYERS.includes(game?.winner)) return game.winner;
  return PLAYERS.includes(previousFirstPlayer) ? previousFirstPlayer : SOUTH;
}

export function playerPits(player) {
  return [...OWN_PITS[player]];
}

export function isOwnPit(player, pitIndex) {
  return OWN_PITS[player].includes(pitIndex);
}

export function positionKey(game) {
  return `${game.currentPlayer}|${game.board.join(',')}`;
}

function ensureRepetitionState(game) {
  if (!game.repetitionCounts || typeof game.repetitionCounts !== 'object') {
    game.repetitionCounts = {};
  }
  const key = positionKey(game);
  if (!Number.isFinite(Number(game.repetitionCounts[key]))) {
    game.repetitionCounts[key] = 1;
  }
  game.lastRepetitionCount = Number(game.repetitionCounts[key]) || 1;
  return game;
}

function registerPosition(game) {
  if (!game.repetitionCounts || typeof game.repetitionCounts !== 'object') {
    game.repetitionCounts = {};
  }
  const key = positionKey(game);
  const count = (Number(game.repetitionCounts[key]) || 0) + 1;
  game.repetitionCounts[key] = count;
  game.lastRepetitionCount = count;
  return count;
}

export function createGame({ firstPlayer = SOUTH } = {}) {
  const game = {
    board: Array(12).fill(4),
    scores: { [SOUTH]: 0, [NORTH]: 0 },
    currentPlayer: firstPlayer,
    status: 'playing',
    winner: null,
    reason: '',
    turn: 1,
    lastMove: null,
    consecutivePasses: 0,
    capote: null,
    resultValue: 1,
    repetitionCounts: {},
    lastRepetitionCount: 1,
  };
  game.repetitionCounts[positionKey(game)] = 1;
  return game;
}

export function cloneGame(game) {
  return {
    ...game,
    board: [...game.board],
    scores: { ...game.scores },
    repetitionCounts: { ...(game.repetitionCounts || {}) },
    lastMove: game.lastMove ? structuredCloneSafe(game.lastMove) : null,
  };
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function rowSeedCountFromBoard(board, player) {
  return OWN_PITS[player].reduce((sum, index) => sum + board[index], 0);
}

export function rowSeedCount(game, player) {
  return rowSeedCountFromBoard(game.board, player);
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
    if (cursor === pitIndex) cursor = nextPit(cursor);
    board[cursor] += 1;
    seeds -= 1;
  }

  return { board, lastPit: cursor };
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

/**
 * Calcula a sementeira e a colheita sem alterar a partida original.
 * Quando o adversário já está sem sementes, uma colheita que retiraria
 * imediatamente as sementes acabadas de lhe dar é anulada. Assim, a jogada
 * de alimentação deixa efectivamente sementes no campo adversário.
 */
function previewMove(game, pitIndex) {
  const player = game.currentPlayer;
  const opponent = otherPlayer(player);
  const opponentWasEmpty = rowSeedCount(game, opponent) === 0;
  const before = [...game.board];
  const { board: sownBoard, lastPit } = sowOnly(game, pitIndex);

  const capturedBoard = [...sownBoard];
  let { capturedPits, capturedSeeds } = captureFrom(capturedBoard, player, lastPit);
  let board = capturedBoard;
  let feedingCaptureCancelled = false;

  if (
    opponentWasEmpty &&
    rowSeedCountFromBoard(sownBoard, opponent) > 0 &&
    rowSeedCountFromBoard(capturedBoard, opponent) === 0
  ) {
    board = sownBoard;
    capturedPits = [];
    capturedSeeds = 0;
    feedingCaptureCancelled = true;
  }

  return {
    player,
    opponent,
    before,
    board,
    lastPit,
    capturedPits,
    capturedSeeds,
    opponentWasEmpty,
    feedingCaptureCancelled,
  };
}

export function legalMoves(game) {
  if (game.status !== 'playing') return [];

  const player = game.currentPlayer;
  const opponent = otherPlayer(player);
  const candidates = OWN_PITS[player].filter((index) => game.board[index] > 0);

  if (!candidates.length) return [];
  if (rowSeedCount(game, opponent) > 0) return candidates;

  // Se o campo adversário está vazio, é obrigatório escolher uma jogada
  // que lhe deixe pelo menos uma semente, desde que tal jogada exista.
  return candidates.filter((index) => {
    const preview = previewMove(game, index);
    return rowSeedCountFromBoard(preview.board, opponent) > 0;
  });
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
  game.capote = null;
  game.resultValue = 1;

  if (game.scores[SOUTH] > game.scores[NORTH]) game.winner = SOUTH;
  else if (game.scores[NORTH] > game.scores[SOUTH]) game.winner = NORTH;
  else game.winner = 'draw';

  if (PLAYERS.includes(game.winner)) {
    const loser = otherPlayer(game.winner);
    if (game.scores[loser] < CAPOTE_LIMIT) {
      game.capote = loser;
      game.resultValue = 2;
    }
  }
}

function finishForcedWinner(game, winner, reason) {
  game.status = 'finished';
  game.reason = reason;
  game.winner = winner;
  game.capote = null;
  game.resultValue = 1;
}

function canFeedOpponentOnNextTurn(game, player) {
  const probe = {
    board: [...game.board],
    scores: { ...game.scores },
    currentPlayer: player,
    status: 'playing',
  };
  return legalMoves(probe).length > 0;
}

export function gameResultValue(game) {
  return Number(game?.resultValue) === 2 ? 2 : 1;
}

export function resignationValue(game, player) {
  if (!PLAYERS.includes(player)) throw new Error('Jogador inválido para desistência.');
  return Number(game?.scores?.[player] || 0) < CAPOTE_LIMIT ? 2 : 1;
}

export function resignGame(game, player) {
  if (!game || game.status !== 'playing') {
    throw new Error('A desistência só é aceite durante uma partida em curso.');
  }
  if (!PLAYERS.includes(player)) throw new Error('Jogador inválido para desistência.');

  const next = cloneGame(game);
  const value = resignationValue(next, player);
  next.status = 'finished';
  next.winner = otherPlayer(player);
  next.reason = 'Desistência.';
  next.resignedBy = player;
  next.capote = value === 2 ? player : null;
  next.resultValue = value;
  next.lastMove = next.lastMove ? { ...next.lastMove } : null;
  return next;
}

export function applyMove(game, pitIndex) {
  const next = cloneGame(game);
  ensureRepetitionState(next);
  const moves = legalMoves(next);
  if (!moves.includes(pitIndex)) {
    const opponent = otherPlayer(next.currentPlayer);
    const starvation = rowSeedCount(next, opponent) === 0;
    throw new Error(
      starvation
        ? 'Jogada inválida: o adversário está sem sementes e tem de ser alimentado.'
        : 'Jogada inválida segundo as regras do Uril de Cabo Verde.',
    );
  }

  const outcome = previewMove(next, pitIndex);
  const { player, opponent } = outcome;
  next.board = [...outcome.board];
  next.scores[player] += outcome.capturedSeeds;

  const grandSlam =
    outcome.capturedSeeds > 0 &&
    OWN_PITS[opponent].every((index) => next.board[index] === 0);

  next.lastMove = {
    player,
    pitIndex,
    before: outcome.before,
    after: [...next.board],
    lastPit: outcome.lastPit,
    capturedPits: outcome.capturedPits,
    capturedSeeds: outcome.capturedSeeds,
    grandSlam,
    fedOpponent: outcome.opponentWasEmpty && rowSeedCount(next, opponent) > 0,
    feedingCaptureCancelled: outcome.feedingCaptureCancelled,
  };
  next.turn += 1;

  next.currentPlayer = opponent;
  const repetitionCount = registerPosition(next);
  next.lastMove.repetitionCount = repetitionCount;

  if (repetitionCount >= REPETITION_LIMIT) {
    next.lastMove.repetitionTriggered = true;
    collectRemainingSeeds(
      next,
      'A mesma posição repetiu-se três vezes. Cada jogador fica com as sementes do seu campo.',
    );
    return next;
  }

  const opponentMoves = legalMoves(next);

  if (grandSlam) {
    const frouxo = canFeedOpponentOnNextTurn(next, player);
    next.lastMove.frouxo = frouxo;
    if (frouxo) {
      finishForcedWinner(
        next,
        opponent,
        'Frouxo: deu fogo podendo alimentar o adversário na jogada seguinte.',
      );
      return next;
    }
  }

  if (opponentMoves.length === 0) {
    const opponentRowEmpty = rowSeedCount(next, opponent) === 0;
    const reason = grandSlam
      ? 'Colheita das seis casas; o jogador que deu fogo não consegue alimentar o adversário na jogada seguinte.'
      : opponentRowEmpty
        ? 'O adversário ficou sem sementes para jogar.'
        : 'Não existe jogada que consiga alimentar o adversário.';
    collectRemainingSeeds(next, reason);
    return next;
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
    lastGameValue: 1,
    lastGameCapote: false,
    message: 'A contagem começa em 0–0.',
  };
}

export function cloneMatch(match) {
  return structuredCloneSafe(match);
}

export function registerGameResult(match, winner, value = 1) {
  const next = cloneMatch(match);
  const gameValue = Number(value) === 2 ? 2 : 1;
  next.gamesPlayed += 1;
  next.lastGameWinner = winner;
  next.lastGameValue = gameValue;
  next.lastGameCapote = gameValue === 2;

  if (winner === 'draw' || !PLAYERS.includes(winner)) {
    next.message = 'Empate: a contagem mantém-se.';
    return next;
  }

  let unitMessage = '';
  for (let unit = 0; unit < gameValue; unit += 1) {
    unitMessage = registerWinUnit(next, winner);
  }

  next.message = gameValue === 2
    ? `CAPOTE: ${labelPlayer(winner)} soma duas partidas. ${unitMessage}`
    : unitMessage;
  return next;
}

function registerWinUnit(next, winner) {
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
      return `${labelPlayer(winner)} cortou a contagem e lidera por 2–0.`;
    }

    return `${labelPlayer(winner)} conseguiu a primeira vitória necessária para cortar a contagem. Falta mais uma consecutiva.`;
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
    return `${labelPlayer(winner)} marcou um Quatro. O Quatro fica registado e só há corte com duas partidas consecutivas do adversário.`;
  }

  return `${labelPlayer(winner)} lidera a contagem actual por ${next.runWins}–0.`;
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
