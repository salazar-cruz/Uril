import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('o banco contra o computador é criado em jogo e aceita espectadores', () => {
  assert.match(multiplayer, /async createComputerRoom/);
  assert.match(multiplayer, /guest_nick: computerNick/);
  assert.match(multiplayer, /status: 'playing'/);
  assert.match(multiplayer, /allow_spectators: true/);
  assert.match(multiplayer, /game_state: session/);
});

test('as jogadas humanas e da IA são sincronizadas com espectadores', () => {
  assert.match(app, /if \(hasSyncedBank\(\)\)[\s\S]*?updateRoomState/);
  assert.match(app, /if \(hasPublicPcBank\(\)\)[\s\S]*?updateRoomState/);
});

test('o anfitrião consegue retomar o banco contra o computador', () => {
  assert.match(app, /async function resumeComputerRoom/);
  assert.match(app, /isComputerRoom\(room\) && isPlayer/);
  assert.match(app, /app\.aiLevel = app\.session\.aiLevel/);
});
