import test from 'node:test';
import assert from 'node:assert/strict';
import { SOUTH, NORTH } from '../js/engine.js?v=0.0.14';
import { boardRowsForPerspective, seatPlayers } from '../js/perspective.js?v=0.0.14';

test('Sul vê o seu campo na fila inferior', () => {
  assert.deepEqual(boardRowsForPerspective(SOUTH), {
    top: [6, 7, 8, 9, 10, 11],
    bottom: [5, 4, 3, 2, 1, 0],
  });
  assert.deepEqual(seatPlayers(SOUTH), { top: NORTH, bottom: SOUTH });
});

test('Norte vê o seu campo na fila inferior com rotação de 180 graus', () => {
  assert.deepEqual(boardRowsForPerspective(NORTH), {
    top: [0, 1, 2, 3, 4, 5],
    bottom: [11, 10, 9, 8, 7, 6],
  });
  assert.deepEqual(seatPlayers(NORTH), { top: SOUTH, bottom: NORTH });
});
