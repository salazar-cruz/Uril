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
  positionKey,
  registerGameResult,
  matchDisplay,
  resignGame,
  resignationValue,
  sowOnly,
  validateGame,
} from '../js/engine.js?v=1.0.7';

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

test('dar fogo é Frouxo quando o jogador ainda consegue alimentar o adversário na jogada seguinte', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[0] = 6;
  game.board[5] = 6;
  for (let i = 6; i < 12; i += 1) game.board[i] = 1;
  const next = applyMove(game, 5);
  assert.equal(next.lastMove.grandSlam, true);
  assert.equal(next.lastMove.frouxo, true);
  assert.equal(next.status, 'finished');
  assert.equal(next.winner, NORTH);
  assert.match(next.reason, /Frouxo/);
  assert.equal(next.currentPlayer, NORTH);
});

test('dar fogo é válido quando o jogador já não consegue alimentar o adversário na jogada seguinte', () => {
  const game = createGame();
  game.board = Array(12).fill(0);
  game.board[5] = 6;
  for (let i = 6; i < 12; i += 1) game.board[i] = 1;
  const next = applyMove(game, 5);
  assert.equal(next.lastMove.grandSlam, true);
  assert.equal(next.lastMove.frouxo, false);
  assert.equal(next.status, 'finished');
  assert.equal(next.winner, SOUTH);
  assert.match(next.reason, /não consegue alimentar/);
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
  game.board[0] = 5;
  game.board[1] = 1;
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

test('um Quatro fica registado e a contagem permanece em 4–0', () => {
  let match = createMatch();
  for (let i = 0; i < 4; i += 1) match = registerGameResult(match, SOUTH);
  assert.equal(match.quatros[SOUTH], 1);
  assert.equal(match.protectedBy, SOUTH);
  assert.equal(match.runOwner, SOUTH);
  assert.equal(match.runWins, 4);
});

test('a contagem continua depois do Quatro', () => {
  let match = createMatch();
  for (let i = 0; i < 6; i += 1) match = registerGameResult(match, SOUTH);
  assert.equal(match.quatros[SOUTH], 1);
  assert.equal(match.protectedBy, SOUTH);
  assert.equal(match.runOwner, SOUTH);
  assert.equal(match.runWins, 6);
});

test('antes do Quatro uma vitória adversária corta e abre 1–0', () => {
  let match = createMatch();
  for (let i = 0; i < 3; i += 1) match = registerGameResult(match, SOUTH);
  match = registerGameResult(match, NORTH);
  assert.equal(match.protectedBy, null);
  assert.equal(match.runOwner, NORTH);
  assert.equal(match.runWins, 1);
});

test('depois de 4–0 o adversário corta apenas com duas vitórias consecutivas', () => {
  let match = createMatch();
  for (let i = 0; i < 5; i += 1) match = registerGameResult(match, SOUTH);
  match = registerGameResult(match, NORTH);
  assert.equal(match.cutWins, 1);
  assert.equal(match.runOwner, SOUTH);
  assert.equal(match.runWins, 5);
  match = registerGameResult(match, NORTH);
  assert.equal(match.protectedBy, null);
  assert.equal(match.runOwner, NORTH);
  assert.equal(match.runWins, 2);
  assert.equal(match.quatros[SOUTH], 1);
});

test('uma tentativa de corte falhada mantém e prolonga a contagem protegida', () => {
  let match = createMatch();
  for (let i = 0; i < 5; i += 1) match = registerGameResult(match, SOUTH);
  match = registerGameResult(match, NORTH);
  match = registerGameResult(match, SOUTH);
  assert.equal(match.protectedBy, SOUTH);
  assert.equal(match.runOwner, SOUTH);
  assert.equal(match.runWins, 6);
  assert.equal(match.cutCandidate, null);
  assert.equal(match.cutWins, 0);
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


test('a terceira repetição da mesma posição termina a partida e cada jogador conserva o seu campo', () => {
  const probe = createGame();
  const target = applyMove(probe, 0);
  const key = positionKey(target);

  const game = createGame();
  game.repetitionCounts[key] = 2;
  const next = applyMove(game, 0);

  assert.equal(next.status, 'finished');
  assert.equal(next.lastMove.repetitionTriggered, true);
  assert.match(next.reason, /repetiu-se três vezes/);
  assert.equal(next.scores[SOUTH], 24);
  assert.equal(next.scores[NORTH], 24);
  assert.equal(next.winner, 'draw');
  assert.deepEqual(next.board, Array(12).fill(0));
  assert.equal(validateGame(next).valid, true);
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
    assert.notEqual(game.status, 'playing', 'a partida não deve entrar num ciclo infinito');
    assert.equal(validateGame(game).total, 48);
  }
});


test('desistir com menos de 12 sementes vale duas partidas', () => {
  const game = createGame();
  game.scores = { [SOUTH]: 11, [NORTH]: 9 };
  game.board = [4,4,4,4,4,0,1,1,1,1,1,3];
  assert.equal(resignationValue(game, SOUTH), 2);
  const next = resignGame(game, SOUTH);
  assert.equal(next.status, 'finished');
  assert.equal(next.winner, NORTH);
  assert.equal(next.resignedBy, SOUTH);
  assert.equal(next.resultValue, 2);
  assert.equal(next.capote, SOUTH);
  assert.equal(validateGame(next).valid, true);
});

test('desistir com 12 ou mais sementes vale uma partida', () => {
  const game = createGame();
  game.scores = { [SOUTH]: 12, [NORTH]: 8 };
  game.board = [4,4,4,4,4,0,1,1,1,1,1,3];
  assert.equal(resignationValue(game, SOUTH), 1);
  const next = resignGame(game, SOUTH);
  assert.equal(next.winner, NORTH);
  assert.equal(next.resultValue, 1);
  assert.equal(next.capote, null);
  assert.equal(validateGame(next).valid, true);
});


test('13 vitórias consecutivas correspondem a 3 Quatros e contagem 1–0', () => {
  let match = createMatch();
  for (let i = 0; i < 13; i += 1) match = registerGameResult(match, SOUTH);
  const display = matchDisplay(match);
  assert.equal(match.quatros[SOUTH], 3);
  assert.equal(match.runWins, 13);
  assert.equal(display.quatros[SOUTH], 3);
  assert.equal(display.score[SOUTH], 1);
});

test('cada novo bloco de quatro vitórias acrescenta um Quatro', () => {
  let match = createMatch();
  for (let i = 0; i < 12; i += 1) match = registerGameResult(match, NORTH);
  const display = matchDisplay(match);
  assert.equal(match.quatros[NORTH], 3);
  assert.equal(display.score[NORTH], 0);
});
