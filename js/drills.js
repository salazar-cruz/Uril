import { SOUTH, createGame, positionKey } from './engine.js?v=1.0.9';

export const ENDGAME_DRILLS = Object.freeze([
  {
    id: 'ouro-01', number: 1, titleKey: 'drill01Title', challengeKey: 'drill01Challenge', difficulty: 4,
    board: [1,2,0,1,2,0,1,0,0,3,2,0], scores: { south: 16, north: 20 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [4,10,1,11,0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-02', number: 2, titleKey: 'drill02Title', challengeKey: 'drill02Challenge', difficulty: 4,
    board: [0,2,0,1,0,1,0,0,0,3,0,1], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,11,0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-03', number: 3, titleKey: 'drill03Title', challengeKey: 'drill03Challenge', difficulty: 3,
    board: [1,0,1,2,0,1,0,0,0,3,0,0], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [0,9,0,10,1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-04', number: 4, titleKey: 'drill04Title', challengeKey: 'drill04Challenge', difficulty: 3,
    board: [0,2,1,2,0,1,0,0,0,0,0,2], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [1,11,3,6,5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-05', number: 5, titleKey: 'drill05Title', challengeKey: 'drill05Challenge', difficulty: 3,
    board: [1,1,2,0,1,2,0,1,0,0,0,0], scores: { south: 18, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5,6,0,7,2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-06', number: 6, titleKey: 'drill06Title', challengeKey: 'drill06Challenge', difficulty: 2,
    board: [0,2,2,0,1,0,0,0,1,0,0,0], scores: { south: 20, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [2,8,1,9,2,10,3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-07', number: 7, titleKey: 'drill07Title', challengeKey: 'drill07Challenge', difficulty: 2,
    board: [0,0,0,3,2,0,0,0,0,0,0,1], scores: { south: 20, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [3,11,0,6,4,6,5],
  },
  {
    id: 'ouro-08', number: 8, titleKey: 'drill08Title', challengeKey: 'drill08Challenge', difficulty: 1,
    board: [0,1,0,0,0,2,0,1,0,0,0,0], scores: { south: 22, north: 22 },
    currentPlayer: SOUTH, humanSide: SOUTH, target: { south: 25, north: 23 },
    solution: [5],
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
  return ENDGAME_DRILLS.every((drill) => {
    const total = drill.board.reduce((sum, seeds) => sum + seeds, 0)
      + drill.scores.south + drill.scores.north;
    return total === 48 && drill.solution.length > 0 && drill.solution[0] >= 0;
  });
}
