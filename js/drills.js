import { SOUTH, createGame, positionKey } from './engine.js?v=1.0.16';

export const DRILL_LEVELS = Object.freeze([
  Object.freeze({ id: 'beginner', labelKey: 'drillLevelBeginner', introKey: 'drillLevelBeginnerIntro' }),
  Object.freeze({ id: 'medium', labelKey: 'drillLevelMedium', introKey: 'drillLevelMediumIntro' }),
  Object.freeze({ id: 'advanced', labelKey: 'drillLevelAdvanced', introKey: 'drillLevelAdvancedIntro' }),
]);

export const ENDGAME_DRILLS = Object.freeze([
  {
    id: 'caso-3-2', number: 1, level: 'beginner', pattern: '3–2', titleKey: 'drillCase32Title', challengeKey: 'drillCase32Challenge', difficulty: 1,
    board: [0,0,0,0,1,2,0,2,0,0,0,0], scores: { south: 21, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5],
  },
  {
    id: 'caso-4-3', number: 2, level: 'beginner', pattern: '4–3', titleKey: 'drillCase43Title', challengeKey: 'drillCase43Challenge', difficulty: 2,
    board: [0,0,2,1,0,1,2,0,0,1,0,0], scores: { south: 19, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5,9,2,10,3,11,4,6,5],
  },
  {
    id: 'caso-5-3', number: 3, level: 'beginner', pattern: '5–3', titleKey: 'drillCase53Title', challengeKey: 'drillCase53Challenge', difficulty: 2,
    board: [1,1,0,3,0,0,0,1,1,0,1,0], scores: { south: 20, north: 20 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,8,2,9,3,10,5],
  },
  {
    id: 'ouro-08', number: 4, level: 'beginner', titleKey: 'drill08Title', challengeKey: 'drill08Challenge', difficulty: 1,
    board: [0,1,0,0,0,2,0,1,0,0,0,0], scores: { south: 22, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5],
  },
  {
    id: 'ouro-07', number: 5, level: 'beginner', titleKey: 'drill07Title', challengeKey: 'drill07Challenge', difficulty: 2,
    board: [0,0,0,3,2,0,0,0,0,0,0,1], scores: { south: 20, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [3,11,0,6,4,6,5],
  },
  {
    id: 'caso-5-4', number: 6, level: 'medium', pattern: '5–4', titleKey: 'drillCase54Title', challengeKey: 'drillCase54Challenge', difficulty: 2,
    board: [0,2,0,2,0,1,0,1,1,0,1,1], scores: { south: 20, north: 19 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [3,10,4,11,5],
  },
  {
    id: 'caso-6-3', number: 7, level: 'medium', pattern: '6–3', titleKey: 'drillCase63Title', challengeKey: 'drillCase63Challenge', difficulty: 3,
    board: [0,0,1,2,3,0,2,0,1,0,0,0], scores: { south: 17, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [3,6,4,6,5],
  },
  {
    id: 'caso-6-4', number: 8, level: 'medium', pattern: '6–4', titleKey: 'drillCase64Title', challengeKey: 'drillCase64Challenge', difficulty: 3,
    board: [2,1,3,0,0,0,2,0,1,0,1,0], scores: { south: 19, north: 19 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [2,10,1,8,2,9,5,11,3,10,4,6,5,11],
  },
  {
    id: 'ouro-06', number: 9, level: 'medium', titleKey: 'drill06Title', challengeKey: 'drill06Challenge', difficulty: 2,
    board: [0,2,2,0,1,0,0,0,1,0,0,0], scores: { south: 20, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-05', number: 10, level: 'medium', titleKey: 'drill05Title', challengeKey: 'drill05Challenge', difficulty: 3,
    board: [1,1,2,0,1,2,0,1,0,0,0,0], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'advanced-6-3', number: 11, level: 'advanced', pattern: '6–3', titleKey: 'drillAdvanced63Title', challengeKey: 'drillAdvanced63Challenge', difficulty: 4,
    board: [1,1,0,0,2,2,2,1,0,0,0,0], scores: { south: 17, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [4,7,5,6,0,7,1,8,3,9,2,11,4,10,0,11,5,6,0,7,1,8,2,9,3,10,5],
  },
  {
    id: 'advanced-6-4', number: 12, level: 'advanced', pattern: '6–4', titleKey: 'drillAdvanced64Title', challengeKey: 'drillAdvanced64Challenge', difficulty: 4,
    board: [3,1,1,1,0,0,1,1,0,0,0,2], scores: { south: 19, north: 19 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,11,0,6,3,7,4,9,1,10,2,11,5,7,0,6,1,8,2,9,3,10,4,11,0,6,5],
  },
  {
    id: 'advanced-6-5', number: 13, level: 'advanced', pattern: '6–5', titleKey: 'drillAdvanced65Title', challengeKey: 'drillAdvanced65Challenge', difficulty: 4,
    board: [0,1,1,2,0,2,0,1,1,1,0,2], scores: { south: 20, north: 17 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [3,11,5,6,4,9,5,7,0,6,1,7,2,10,4,11,5,6,0,7,3,8,4,9,5,10,0,11],
  },
  {
    id: 'advanced-5-4', number: 14, level: 'advanced', pattern: '5–4', titleKey: 'drillAdvanced54Title', challengeKey: 'drillAdvanced54Challenge', difficulty: 4,
    board: [1,1,1,0,1,1,1,0,1,0,1,1], scores: { south: 22, north: 17 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,6,2,7,1,8,3,11,0,9,5,7,1,6,2,7,4,6,5,7,3,8,4,10,0,9,5,11],
  },
  {
    id: 'advanced-5-3', number: 15, level: 'advanced', pattern: '5–3', titleKey: 'drillAdvanced53Title', challengeKey: 'drillAdvanced53Challenge', difficulty: 4,
    board: [2,1,0,1,0,1,2,0,1,0,0,0], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,6,5,7,1,8,2,6,3,9,4,11,5,6,0,10,0,11,0,7,1,8,3,9,4,10,5],
  },
  {
    id: 'advanced-4-3', number: 16, level: 'advanced', pattern: '4–3', titleKey: 'drillAdvanced43Title', challengeKey: 'drillAdvanced43Challenge', difficulty: 4,
    board: [0,2,0,0,2,0,0,2,0,0,0,1], scores: { south: 22, north: 19 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,7,2,9,4,8,3,6,4,7,5,11,0,9,1,6,2,7,3,8,4,9,5,10,0,11],
  },
  {
    id: 'advanced-5-5', number: 17, level: 'advanced', pattern: '5–5', titleKey: 'drillAdvanced55Title', challengeKey: 'drillAdvanced55Challenge', difficulty: 4,
    board: [1,1,1,0,1,1,0,1,0,0,3,1], scores: { south: 18, north: 20 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,11,0,7,1,10,0,11,5,8,0,6,4,9,3,6,4,7,1,9,2,8,3,10,5,11,4],
  },
  {
    id: 'advanced-4-4', number: 18, level: 'advanced', pattern: '4–4', titleKey: 'drillAdvanced44Title', challengeKey: 'drillAdvanced44Challenge', difficulty: 4,
    board: [0,0,1,1,1,1,0,3,1,0,0,0], scores: { south: 22, north: 18 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [2,8,4,7,3,9,4,10,5,11,0,6,2,7,1,9,3,11,5,8,0,11,4,9,2,10,5],
  },
  {
    id: 'advanced-7-4', number: 19, level: 'advanced', pattern: '7–4', titleKey: 'drillAdvanced74Title', challengeKey: 'drillAdvanced74Challenge', difficulty: 4,
    board: [3,1,2,1,0,0,1,0,0,0,2,1], scores: { south: 19, north: 18 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,11,3,6,0,10,1,11,2,6,4,6,5,7,3,9,5,10,4,11,0,8,5,9,1,10,2,11],
  },
  {
    id: 'advanced-7-5', number: 20, level: 'advanced', pattern: '7–5', titleKey: 'drillAdvanced75Title', challengeKey: 'drillAdvanced75Challenge', difficulty: 4,
    board: [0,2,1,3,1,0,0,0,1,2,1,1], scores: { south: 24, north: 12 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,9,2,8,3,11,0,6,5,6,4,7,1,6,5,10,1,7,0,8,3,11,0,9,0,10,4,11],
  },
]);

export function getEndgameDrill(id) {
  return ENDGAME_DRILLS.find((drill) => drill.id === id) || ENDGAME_DRILLS[0];
}

export function createEndgameDrillGame(drill) {
  const game = createGame({ firstPlayer: drill.currentPlayer });
  game.board = [...drill.board];
  game.scores = { ...drill.scores };
  game.currentPlayer = drill.currentPlayer;
  game.turn = 40;
  game.lastMove = null;
  game.status = 'playing';
  game.winner = null;
  game.reason = '';
  game.capote = null;
  game.resultValue = 1;
  game.repetitionCounts = { [positionKey(game)]: 1 };
  game.lastRepetitionCount = 1;
  return game;
}

export function validateEndgameDrills() {
  const validLevels = new Set(DRILL_LEVELS.map((level) => level.id));
  return ENDGAME_DRILLS.every((drill) => {
    const total = drill.board.reduce((sum, seeds) => sum + seeds, 0)
      + drill.scores.south + drill.scores.north;
    const patternValid = !drill.pattern || /^\d+–\d+$/.test(drill.pattern);
    return total === 48
      && validLevels.has(drill.level)
      && patternValid
      && drill.solution.length > 0
      && drill.solution[0] >= 0;
  });
}
