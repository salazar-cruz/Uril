import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseMove, levelConfig, levelLabel, shouldOfferResignation } from '../js/ai.js?v=1.0.13';
import { NORTH, SOUTH, createGame } from '../js/engine.js?v=1.0.13';

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


test('os quatro níveis foram elevados e o Grande Mestre equilibra profundidade e tempo de resposta', () => {
  assert.deepEqual(levelConfig('apprentice'), {
    label: 'Aprendiz', maxDepth: 4, timeMs: 320, randomness: 0.12,
  });
  assert.deepEqual(levelConfig('amateur'), {
    label: 'Amador', maxDepth: 8, timeMs: 950, randomness: 0,
  });
  assert.deepEqual(levelConfig('master'), {
    label: 'Mestre', maxDepth: 12, timeMs: 2600, randomness: 0,
  });
  assert.deepEqual(levelConfig('grandmaster'), {
    label: 'Grande Mestre', maxDepth: 18, timeMs: 4800, randomness: 0,
  });
});
