import {
  SOUTH,
  NORTH,
  applyMove,
  legalMoves,
  otherPlayer,
  playerPits,
  rowSeedCount,
} from './engine.js?v=0.0.15';

const LEVELS = {
  apprentice: {
    label: 'Aprendiz',
    maxDepth: 1,
    timeMs: 40,
    randomness: 1,
  },
  amateur: {
    label: 'Amador',
    maxDepth: 4,
    timeMs: 320,
    randomness: 0.12,
  },
  master: {
    label: 'Mestre',
    maxDepth: 8,
    timeMs: 950,
    randomness: 0,
  },
  grandmaster: {
    label: 'Grande Mestre',
    maxDepth: 12,
    timeMs: 2600,
    randomness: 0,
  },
};

const LEVEL_ALIASES = {
  player: 'amateur',
};

class SearchTimeout extends Error {}

function now() {
  return globalThis.performance?.now?.() ?? Date.now();
}

function normaliseLevel(level) {
  return LEVEL_ALIASES[level] || (LEVELS[level] ? level : 'amateur');
}

export function levelLabel(level) {
  return LEVELS[normaliseLevel(level)].label;
}

export function shouldOfferResignation(game, player = NORTH) {
  if (!game || game.status !== 'playing' || game.currentPlayer !== player) return false;
  const opponent = otherPlayer(player);
  const seedsStillOnBoard = game.board.reduce((sum, seeds) => sum + Number(seeds || 0), 0);
  const maximumPossible = Number(game.scores[player] || 0) + seedsStillOnBoard;
  return maximumPossible < Number(game.scores[opponent] || 0);
}

export function chooseMove(game, requestedLevel = 'amateur') {
  const moves = legalMoves(game);
  if (!moves.length) return null;
  if (moves.length === 1) return moves[0];

  const level = normaliseLevel(requestedLevel);
  const config = LEVELS[level];

  if (config.randomness >= 1 || Math.random() < config.randomness) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const perspective = game.currentPlayer;
  const deadline = now() + config.timeMs;
  const table = new Map();

  let bestMove = tacticalFallback(game, moves, perspective);
  let preferredMove = bestMove;

  for (let depth = 1; depth <= config.maxDepth; depth += 1) {
    try {
      const result = searchRoot(
        game,
        depth,
        perspective,
        deadline,
        table,
        preferredMove,
      );
      bestMove = result.move;
      preferredMove = result.move;

      if (Math.abs(result.value) >= 900000) break;
    } catch (error) {
      if (error instanceof SearchTimeout) break;
      throw error;
    }
  }

  return bestMove;
}

function searchRoot(game, depth, perspective, deadline, table, preferredMove) {
  checkDeadline(deadline);
  const moves = orderMoves(
    game,
    legalMoves(game),
    perspective,
    true,
    preferredMove,
  );

  let bestMove = moves[0];
  let bestValue = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of moves) {
    checkDeadline(deadline);
    const child = applyMove(game, move);
    const value = minimax(
      child,
      depth - 1,
      alpha,
      beta,
      perspective,
      deadline,
      table,
      1,
    );

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestValue);
  }

  return { move: bestMove, value: bestValue };
}

function minimax(game, depth, alpha, beta, perspective, deadline, table, ply) {
  checkDeadline(deadline);

  if (game.status === 'finished') return terminalValue(game, perspective, ply);
  if (depth <= 0) return evaluate(game, perspective);

  const key = stateKey(game);
  const cached = table.get(key);
  if (cached && cached.depth >= depth) {
    if (cached.flag === 'exact') return cached.value;
    if (cached.flag === 'lower') alpha = Math.max(alpha, cached.value);
    if (cached.flag === 'upper') beta = Math.min(beta, cached.value);
    if (alpha >= beta) return cached.value;
  }

  const moves = legalMoves(game);
  if (!moves.length) return evaluate(game, perspective);

  const maximizing = game.currentPlayer === perspective;
  const alphaOriginal = alpha;
  const betaOriginal = beta;
  let value = maximizing ? -Infinity : Infinity;
  let bestMove = cached?.bestMove ?? null;

  const ordered = orderMoves(
    game,
    moves,
    perspective,
    maximizing,
    bestMove,
  );

  for (const move of ordered) {
    checkDeadline(deadline);
    const child = applyMove(game, move);
    const candidate = minimax(
      child,
      depth - 1,
      alpha,
      beta,
      perspective,
      deadline,
      table,
      ply + 1,
    );

    if (maximizing) {
      if (candidate > value) {
        value = candidate;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      if (candidate < value) {
        value = candidate;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }

    if (beta <= alpha) break;
  }

  let flag = 'exact';
  if (value <= alphaOriginal) flag = 'upper';
  else if (value >= betaOriginal) flag = 'lower';
  table.set(key, { depth, value, flag, bestMove });

  return value;
}

function checkDeadline(deadline) {
  if (now() >= deadline) throw new SearchTimeout();
}

function stateKey(game) {
  const repetitionState = Object.entries(game.repetitionCounts || {})
    .filter(([, count]) => Number(count) > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, count]) => `${key}=${count}`)
    .join(';');

  return [
    game.currentPlayer,
    game.scores[SOUTH],
    game.scores[NORTH],
    ...game.board,
    repetitionState,
  ].join('|');
}

function terminalValue(game, perspective, ply) {
  const opponent = otherPlayer(perspective);
  if (game.winner === perspective) return 1000000 - ply * 100;
  if (game.winner === opponent) return -1000000 + ply * 100;
  return 0;
}

function tacticalFallback(game, moves, perspective) {
  return orderMoves(game, moves, perspective, true, null)[0];
}

function orderMoves(game, moves, perspective, maximizing, preferredMove) {
  const ranked = moves.map((move) => {
    const child = applyMove(game, move);
    return {
      move,
      priority: movePriority(game, child, perspective),
    };
  });

  ranked.sort((left, right) => {
    if (left.move === preferredMove) return -1;
    if (right.move === preferredMove) return 1;
    return maximizing
      ? right.priority - left.priority
      : left.priority - right.priority;
  });

  return ranked.map((entry) => entry.move);
}

function movePriority(before, after, perspective) {
  if (after.status === 'finished') return terminalValue(after, perspective, 1);

  const move = after.lastMove;
  const scoreSwing =
    (after.scores[perspective] - before.scores[perspective]) -
    (after.scores[otherPlayer(perspective)] - before.scores[otherPlayer(perspective)]);

  let value = scoreSwing * 500;
  if (move?.grandSlam) value += move.player === perspective ? 5000 : -5000;
  if (move?.fedOpponent) value += move.player === perspective ? 90 : -90;
  value += evaluate(after, perspective);
  return value;
}

function evaluate(game, perspective) {
  const opponent = otherPlayer(perspective);
  if (game.status === 'finished') return terminalValue(game, perspective, 0);

  const scoreDiff = game.scores[perspective] - game.scores[opponent];
  const seedDiff = rowSeedCount(game, perspective) - rowSeedCount(game, opponent);
  const mobility = legalMoveCountFor(game, perspective) - legalMoveCountFor(game, opponent);
  const vulnerable = vulnerableSeeds(game, opponent) - vulnerableSeeds(game, perspective);
  const emptyPits = emptyPitCount(game, opponent) - emptyPitCount(game, perspective);
  const largePits = largePitCount(game, perspective) - largePitCount(game, opponent);
  const starvation = starvationPressure(game, perspective) - starvationPressure(game, opponent);

  return (
    scoreDiff * 145 +
    seedDiff * 2.2 +
    mobility * 8 +
    vulnerable * 3.2 +
    emptyPits * 1.4 +
    largePits * 2.5 +
    starvation * 18
  );
}

function legalMoveCountFor(game, player) {
  const shadow = {
    ...game,
    currentPlayer: player,
    board: [...game.board],
    scores: { ...game.scores },
    status: game.status,
  };
  return legalMoves(shadow).length;
}

function vulnerableSeeds(game, player) {
  return playerPits(player).reduce((sum, index) => {
    const seeds = game.board[index];
    return sum + (seeds === 1 || seeds === 2 ? seeds : 0);
  }, 0);
}

function emptyPitCount(game, player) {
  return playerPits(player).filter((index) => game.board[index] === 0).length;
}

function largePitCount(game, player) {
  return playerPits(player).filter((index) => game.board[index] >= 12).length;
}

function starvationPressure(game, player) {
  const opponent = otherPlayer(player);
  if (rowSeedCount(game, opponent) !== 0) return 0;

  const shadow = {
    ...game,
    currentPlayer: player,
    board: [...game.board],
    scores: { ...game.scores },
    status: game.status,
  };
  return legalMoves(shadow).length ? 1 : -2;
}

export const AI_LEVELS = LEVELS;
