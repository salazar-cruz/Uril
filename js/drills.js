import { SOUTH, createGame, positionKey } from './engine.js?v=1.0.12';

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
    id: 'ouro-04', number: 11, level: 'advanced', titleKey: 'drill04Title', challengeKey: 'drill04Challenge', difficulty: 3,
    board: [0,2,1,2,0,1,0,0,0,0,0,2], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-03', number: 12, level: 'advanced', titleKey: 'drill03Title', challengeKey: 'drill03Challenge', difficulty: 3,
    board: [1,0,1,2,0,1,0,0,0,3,0,0], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-02', number: 13, level: 'advanced', titleKey: 'drill02Title', challengeKey: 'drill02Challenge', difficulty: 4,
    board: [0,2,0,1,0,1,0,0,0,3,0,1], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,11,0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-01', number: 14, level: 'advanced', titleKey: 'drill01Title', challengeKey: 'drill01Challenge', difficulty: 4,
    board: [1,2,0,1,2,0,1,0,0,3,2,0], scores: { south: 16, north: 20 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [4,10,1,11,0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
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
