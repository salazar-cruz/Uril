import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('a listagem inclui bancos em espera, Live e concluídos', () => {
  assert.match(multiplayer, /\.in\('status', \['waiting', 'playing', 'finished'\]\)/);
  assert.match(multiplayer, /30 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(multiplayer, /\.limit\(100\)/);
});

test('o modo de consulta não altera a partida original', () => {
  assert.match(app, /function reviewEntry/);
  assert.match(app, /reviewEntry\(\)\?\.game \|\| app\.session\.game/);
  assert.match(app, /if \(app\.reviewMode\) return false;/);
  assert.match(app, /app\.mode = 'review'/);
});
