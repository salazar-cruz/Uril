import {
  SOUTH,
  NORTH,
  applyMove,
  legalMoves,
  otherPlayer,
  playerPits,
  rowSeedCount,
} from './engine.js';

const LEVELS = {
  apprentice: { depth: 0, randomness: 1, label: 'Aprendiz' },
  player: { depth: 2, randomness: 0.22, label: 'Jogador' },
  master: { depth: 4, randomness: 0.05, label: 'Mestre' },
  grandmaster: { depth: 6, randomness: 0, label: 'Grande Mestre' },
};

export function levelLabel(level) {
  return LEVELS[level]?.label || LEVELS.player.label;
}

export function chooseMove(game, level = 'player') {
  const moves = legalMoves(game);
  if (!moves.length) return null;

  const config = LEVELS[level] || LEVELS.player;
  if (config.depth === 0 || Math.random() < config.randomness) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const perspective = game.currentPlayer;
  const deadline = performance.now() + (level === 'grandmaster' ? 900 : level === 'master' ? 450 : 160);
  let bestMove = moves[0];
  let bestValue = -Infinity;

  for (const move of orderMoves(game, moves, perspective)) {
    const child = applyMove(game, move);
    const value = minimax(
      child,
      config.depth - 1,
      -Infinity,
      Infinity,
      perspective,
      deadline,
    );
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(game, depth, alpha, beta, perspective, deadline) {
  if (depth <= 0 || game.status === 'finished' || performance.now() > deadline) {
    return evaluate(game, perspective);
  }

  const moves = legalMoves(game);
  if (!moves.length) return evaluate(game, perspective);

  const maximizing = game.currentPlayer === perspective;
  let value = maximizing ? -Infinity : Infinity;

  for (const move of orderMoves(game, moves, perspective)) {
    const child = applyMove(game, move);
    const candidate = minimax(child, depth - 1, alpha, beta, perspective, deadline);
    if (maximizing) {
      value = Math.max(value, candidate);
      alpha = Math.max(alpha, value);
    } else {
      value = Math.min(value, candidate);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha || performance.now() > deadline) break;
  }
  return value;
}

function orderMoves(game, moves, perspective) {
  return [...moves].sort((a, b) => {
    const aState = applyMove(game, a);
    const bState = applyMove(game, b);
    return evaluate(bState, perspective) - evaluate(aState, perspective);
  });
}

function evaluate(game, perspective) {
  const opponent = otherPlayer(perspective);
  if (game.status === 'finished') {
    if (game.winner === perspective) return 100000;
    if (game.winner === opponent) return -100000;
    return 0;
  }

  const scoreDiff = game.scores[perspective] - game.scores[opponent];
  const seedDiff = rowSeedCount(game, perspective) - rowSeedCount(game, opponent);
  const mobility = legalMoveCountFor(game, perspective) - legalMoveCountFor(game, opponent);
  const vulnerable = vulnerableSeeds(game, opponent) - vulnerableSeeds(game, perspective);
  const kroo = krooCount(game, perspective) - krooCount(game, opponent);

  return scoreDiff * 18 + seedDiff * 0.7 + mobility * 2.4 + vulnerable * 1.8 + kroo * 1.2;
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

function krooCount(game, player) {
  return playerPits(player).filter((index) => game.board[index] >= 12).length;
}

export const AI_LEVELS = LEVELS;
