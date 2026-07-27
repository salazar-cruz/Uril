import {
  SOUTH,
  NORTH,
  applyMove,
  legalMoves,
  otherPlayer,
  playerPits,
  rowSeedCount,
} from './engine.js?v=1.0.6';

const LEVELS = {
  apprentice: {
    label: 'Aprendiz',
    maxDepth: 4,
    timeMs: 320,
    randomness: 0.12,
  },
  amateur: {
    label: 'Amador',
    maxDepth: 8,
    timeMs: 950,
    randomness: 0,
  },
  master: {
    label: 'Mestre',
    maxDepth: 12,
    timeMs: 2600,
    randomness: 0,
  },
  grandmaster: {
    label: 'Grande Mestre',
    maxDepth: 24,
    timeMs: 12000,
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

export function levelConfig(level) {
  return { ...LEVELS[normaliseLevel(level)] };
}

export function shouldOfferResignation(game, player = NORTH) {
  if (!game || game.status !== 'playing' || game.currentPlayer !== player) return false;
  const opponent = otherPlayer(player);
  const seedsStillOnBoard = game.board.reduce((sum, seeds) => sum + Number(seeds || 0), 0);
  const maximumPossible = Number(game.scores[player] || 0) + seedsStillOnBoard;
  return maximumPossible < Number(game.scores[opponent] || 0);
}

export function chooseMove(game, requestedLevel = 'amateur') {
  return analysePosition(game, requestedLevel).move;
}

export function analysePosition(game, requestedLevel = 'amateur', options = {}) {
  const startedAt = now();
  const moves = legalMoves(game);
  const level = normaliseLevel(requestedLevel);
  const baseConfig = LEVELS[level];
  const config = {
    ...baseConfig,
    maxDepth: Number(options.maxDepth) || baseConfig.maxDepth,
    timeMs: Number(options.timeMs) || baseConfig.timeMs,
    randomness: options.allowRandom === false ? 0 : baseConfig.randomness,
  };

  if (!moves.length) {
    return {
      move: null,
      value: evaluate(game, game.currentPlayer),
      completedDepth: 0,
      nodes: 0,
      timeMs: Math.round(now() - startedAt),
      principalVariation: [],
      level,
      maxDepth: config.maxDepth,
    };
  }

  if (moves.length === 1) {
    return {
      move: moves[0],
      value: movePriority(game, applyMove(game, moves[0]), game.currentPlayer),
      completedDepth: 1,
      nodes: 1,
      timeMs: Math.round(now() - startedAt),
      principalVariation: [moves[0]],
      level,
      maxDepth: config.maxDepth,
    };
  }

  if (config.randomness >= 1 || (config.randomness > 0 && Math.random() < config.randomness)) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    return {
      move,
      value: movePriority(game, applyMove(game, move), game.currentPlayer),
      completedDepth: 1,
      nodes: moves.length,
      timeMs: Math.round(now() - startedAt),
      principalVariation: [move],
      level,
      maxDepth: config.maxDepth,
      random: true,
    };
  }

  const perspective = game.currentPlayer;
  const deadline = startedAt + config.timeMs;
  const table = new Map();
  const stats = { nodes: 0 };

  let bestMove = tacticalFallback(game, moves, perspective);
  let bestValue = movePriority(game, applyMove(game, bestMove), perspective);
  let preferredMove = bestMove;
  let completedDepth = 0;
  let principalVariation = [bestMove];

  for (let depth = 1; depth <= config.maxDepth; depth += 1) {
    try {
      const result = searchRoot(
        game,
        depth,
        perspective,
        deadline,
        table,
        preferredMove,
        stats,
      );
      bestMove = result.move;
      bestValue = result.value;
      preferredMove = result.move;
      completedDepth = depth;
      principalVariation = buildPrincipalVariation(game, bestMove, table, depth);

      if (Math.abs(result.value) >= 900000) break;
    } catch (error) {
      if (error instanceof SearchTimeout) break;
      throw error;
    }
  }

  return {
    move: bestMove,
    value: bestValue,
    completedDepth,
    nodes: stats.nodes,
    timeMs: Math.round(now() - startedAt),
    principalVariation,
    level,
    maxDepth: config.maxDepth,
  };
}

export function evaluatePosition(game, perspective = game?.currentPlayer || SOUTH) {
  return evaluate(game, perspective);
}

function searchRoot(game, depth, perspective, deadline, table, preferredMove, stats) {
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
    stats.nodes += 1;
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
      stats,
    );

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestValue);
  }

  return { move: bestMove, value: bestValue };
}

function minimax(game, depth, alpha, beta, perspective, deadline, table, ply, stats) {
  checkDeadline(deadline);
  stats.nodes += 1;

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
      stats,
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

function buildPrincipalVariation(game, firstMove, table, depth) {
  const line = [];
  let current = game;
  let move = firstMove;

  for (let ply = 0; ply < depth && move !== null && move !== undefined; ply += 1) {
    const moves = legalMoves(current);
    if (!moves.includes(move)) break;
    line.push(move);
    current = applyMove(current, move);
    if (current.status === 'finished') break;
    move = table.get(stateKey(current))?.bestMove ?? null;
  }

  return line;
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
