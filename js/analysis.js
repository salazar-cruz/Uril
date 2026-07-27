import { analysePosition, evaluatePosition } from './ai.js?v=1.0.9';
import { applyMove, legalMoves } from './engine.js?v=1.0.9';

export function classifyLoss(loss) {
  const value = Math.abs(Number(loss) || 0);
  if (value <= 25) return 'best';
  if (value <= 90) return 'good';
  if (value <= 220) return 'inaccuracy';
  if (value <= 600) return 'mistake';
  return 'blunder';
}

export function analysePlayedMove(beforeGame, pitIndex, options = {}) {
  if (!beforeGame || !legalMoves(beforeGame).includes(pitIndex)) return null;
  const player = beforeGame.currentPlayer;
  const search = analysePosition(beforeGame, options.level || 'master', {
    allowRandom: false,
    maxDepth: options.maxDepth || 8,
    timeMs: options.timeMs || 1200,
  });
  const playedGame = applyMove(beforeGame, pitIndex);
  const playedValue = playedGame.status === 'finished'
    ? evaluatePosition(playedGame, player)
    : -evaluatePosition(playedGame, playedGame.currentPlayer);
  const bestValue = Number(search.value) || 0;
  const loss = Math.max(0, bestValue - playedValue);

  return {
    bestMove: search.move,
    playedMove: pitIndex,
    bestValue,
    playedValue,
    loss,
    classification: pitIndex === search.move ? 'best' : classifyLoss(loss),
    completedDepth: search.completedDepth,
    nodes: search.nodes,
    timeMs: search.timeMs,
    principalVariation: search.principalVariation,
  };
}

export function moveFacts(entry = {}) {
  const before = entry.board_before || entry.before_game?.board || [];
  const after = entry.board_after || entry.after_game?.board || [];
  return {
    ply: Number(entry.ply || entry.move_no || 0),
    side: entry.player_side || entry.player || null,
    pitIndex: Number(entry.pit_index ?? entry.pitIndex ?? -1),
    capturedSeeds: Number(entry.captured_seeds ?? entry.capturedSeeds ?? 0),
    capturedPits: entry.captured_pits || entry.capturedPits || [],
    grandSlam: Boolean(entry.grand_slam ?? entry.grandSlam),
    frouxo: Boolean(entry.frouxo),
    fedOpponent: Boolean(entry.fed_opponent ?? entry.fedOpponent),
    before,
    after,
    createdAt: entry.created_at || entry.at || null,
  };
}
