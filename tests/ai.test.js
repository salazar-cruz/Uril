import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseMove, levelLabel, shouldOfferResignation } from '../js/ai.js?v=0.0.17';
import { NORTH, SOUTH, createGame } from '../js/engine.js?v=0.0.17';

test('o segundo nível chama-se Amador, incluindo o nome antigo guardado em cache', () => {
  assert.equal(levelLabel('amateur'), 'Amador');
  assert.equal(levelLabel('player'), 'Amador');
});

test('Grande Mestre escolhe uma vitória imediata em vez de uma jogada neutra', () => {
  const game = createGame({ firstPlayer: NORTH });
  game.board = Array(12).fill(0);
  game.board[0] = 1;
  game.board[6] = 1;
  game.board[11] = 1;
  game.scores = { [SOUTH]: 0, [NORTH]: 24 };

  assert.equal(chooseMove(game, 'grandmaster'), 11);
});


test('a IA pede desistência apenas quando já não existe vitória matemática', () => {
  const lost = createGame({ firstPlayer: NORTH });
  lost.scores = { [SOUTH]: 30, [NORTH]: 10 };
  lost.board = [1,1,1,1,1,1,1,1,0,0,0,0];
  assert.equal(shouldOfferResignation(lost, NORTH), true);

  const open = createGame({ firstPlayer: NORTH });
  open.scores = { [SOUTH]: 20, [NORTH]: 10 };
  open.board = [2,2,2,2,2,2,4,4,2,2,2,2];
  assert.equal(shouldOfferResignation(open, NORTH), false);
});
