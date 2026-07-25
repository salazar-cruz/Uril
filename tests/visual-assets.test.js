import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const seedFour = await readFile(new URL('../assets/integrated-v21/seeds-04.png', import.meta.url));
const board = await readFile(new URL('../assets/integrated-v21/board-organic.png', import.meta.url));

test('os novos activos gráficos existem e não estão vazios', () => {
  assert.ok(seedFour.byteLength > 10000);
  assert.ok(board.byteLength > 100000);
});
