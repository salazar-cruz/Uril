import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseMove, levelLabel } from '../js/ai.js?v=0.0.11';
import { NORTH, SOUTH, createGame } from '../js/engine.js?v=0.0.11';

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
