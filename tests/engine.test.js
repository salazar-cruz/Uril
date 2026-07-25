import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOUTH,
  NORTH,
  applyMove,
  createGame,
  createMatch,
  gameResultValue,
  legalMoves,
  nextRoundStarter,
  registerGameResult,
  sowOnly,
  validateGame,
} from '../js/engine.js?v=0.0.8';

test('a posição inicial oferece as seis casas de Sul', () => {
  const game = createGame();
  assert.deepEqual(legalMoves(game), [0, 1, 2, 3, 4, 5]);
});

test('uma volta completa salta a casa de origem', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[0] = 13;
  const result = sowOnly(game, 0);
  assert.equal(result.board[0], 0);
  assert.equal(result.board[1], 2);
  assert.equal(result.board[2], 2);
  assert.equal(result.board.reduce((a, b) => a + b, 0), 13);
});

test('a colheita múltipla recolhe casas adversárias consecutivas com 2 ou 3', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[5] = 3;
  game.board[6] = 1;
  game.board[7] = 1;
  game.board[8] = 1;
  const next = applyMove(game, 5);
  assert.equal(next.scores[SOUTH], 6);
  assert.deepEqual(next.lastMove.capturedPits, [8, 7, 6]);
  assert.equal(next.board[6] + next.board[7] + next.board[8], 0);
});

test('a colheita das seis casas termina se o adversário ficar sem jogada', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[0] = 6;
  game.board[5] = 6;
  for (let i = 6; i < 12; i += 1) game.board[i] = 1;
  const next = applyMove(game, 5);
  assert.equal(next.lastMove.grandSlam, true);
  assert.equal(next.status, 'finished');
  assert.equal(next.winner, SOUTH);
  assert.equal(next.currentPlayer, NORTH);
});

test('uma casa própria com uma semente é jogável normalmente', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[0] = 1;
  game.board[1] = 2;
  game.board[6] = 4;
  assert.deepEqual(legalMoves(game), [0, 1]);
});

test('com o adversário vazio só ficam válidas as casas que o alimentam', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[0] = 1;
  game.board[5] = 1;
  assert.deepEqual(legalMoves(game), [5]);
});

test('uma casa com uma semente alimenta o adversário e a partida continua', () => {
  const game = createGame({ firstPlayer: NORTH });
  game.board = Array(12).fill(0);
  game.board[6] = 1;
  game.board[11] = 1;
  assert.deepEqual(legalMoves(game), [11]);

  const next = applyMove(game, 11);
  assert.equal(next.status, 'playing');
  assert.equal(next.currentPlayer, SOUTH);
  assert.equal(next.board[0], 1);
});

test('a partida termina apenas quando não existe jogada de alimentação', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[5] = 2;

  const next = applyMove(game, 5);
  assert.equal(next.status, 'finished');
  assert.match(next.reason, /alimentar/);
  assert.equal(next.scores[NORTH], 2);
});

test('a partida não termina quando um jogador ultrapassa 25 sementes', () => {
  const game = createGame();
  game.scores = { [SOUTH]: 25, [NORTH]: 0 };
  game.board = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 7];
  const next = applyMove(game, 0);
  assert.equal(next.status, 'playing');
  assert.ok(next.scores[SOUTH] >= 25);
  assert.equal(validateGame(next).valid, true);
});

test('o motor assinala Capote quando o derrotado fica abaixo de 12', () => {
  const game = createGame();
  game.scores = { [SOUTH]: 20, [NORTH]: 10 };
  game.board = Array(12).fill(0);
  game.board[0] = 6;
  game.board[5] = 6;
  for (let i = 6; i < 12; i += 1) game.board[i] = 1;

  const next = applyMove(game, 5);
  assert.equal(next.status, 'finished');
  assert.equal(next.winner, SOUTH);
  assert.equal(next.scores[NORTH], 10);
  assert.equal(next.resultValue, 2);
  assert.equal(next.capote, NORTH);
  assert.equal(validateGame(next).total, 48);
});

test('um Capote vale duas partidas na contagem', () => {
  let match = createMatch();
  match = registerGameResult(match, SOUTH, 2);
  assert.equal(match.runOwner, SOUTH);
  assert.equal(match.runWins, 2);
  assert.equal(match.lastGameCapote, true);
  assert.match(match.message, /CAPOTE/);
});

test('um Capote corta de imediato uma contagem protegida', () => {
  let match = createMatch();
  for (let i = 0; i < 4; i += 1) match = registerGameResult(match, SOUTH);
  match = registerGameResult(match, NORTH, 2);
  assert.equal(match.protectedBy, null);
  assert.equal(match.runOwner, NORTH);
  assert.equal(match.runWins, 2);
  assert.equal(match.quatros[SOUTH], 1);
});

test('o valor de resultado reconhece um Capote', () => {
  const game = createGame();
  game.status = 'finished';
  game.winner = SOUTH;
  game.resultValue = 2;
  assert.equal(gameResultValue(game), 2);
});

test('um Quatro fica registado após quatro vitórias consecutivas', () => {
  let match = createMatch();
  for (let i = 0; i < 4; i += 1) match = registerGameResult(match, SOUTH);
  assert.equal(match.quatros[SOUTH], 1);
  assert.equal(match.protectedBy, SOUTH);
  assert.equal(match.runOwner, null);
});

test('o adversário corta a contagem apenas com duas vitórias consecutivas', () => {
  let match = createMatch();
  for (let i = 0; i < 4; i += 1) match = registerGameResult(match, SOUTH);
  match = registerGameResult(match, NORTH);
  assert.equal(match.cutWins, 1);
  assert.equal(match.runOwner, null);
  match = registerGameResult(match, NORTH);
  assert.equal(match.protectedBy, null);
  assert.equal(match.runOwner, NORTH);
  assert.equal(match.runWins, 2);
  assert.equal(match.quatros[SOUTH], 1);
});

test('o vencedor começa sempre a partida seguinte', () => {
  const game = createGame({ firstPlayer: NORTH });
  game.status = 'finished';
  game.winner = SOUTH;
  assert.equal(nextRoundStarter(game, NORTH), SOUTH);

  game.winner = NORTH;
  assert.equal(nextRoundStarter(game, SOUTH), NORTH);
});

test('num empate volta a começar quem abriu a partida empatada', () => {
  const game = createGame({ firstPlayer: SOUTH });
  game.status = 'finished';
  game.winner = 'draw';
  assert.equal(nextRoundStarter(game, SOUTH), SOUTH);
  assert.equal(nextRoundStarter(game, NORTH), NORTH);
});

test('jogadas aleatórias conservam sempre as 48 sementes', () => {
  for (let sample = 0; sample < 80; sample += 1) {
    let game = createGame({ firstPlayer: sample % 2 ? NORTH : SOUTH });
    let safety = 0;
    while (game.status === 'playing' && safety < 1200) {
      const moves = legalMoves(game);
      assert.ok(moves.length > 0);
      game = applyMove(game, moves[Math.floor(Math.random() * moves.length)]);
      assert.equal(validateGame(game).valid, true);
      safety += 1;
    }
    assert.equal(validateGame(game).total, 48);
  }
});
