import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MultiplayerService } from '../js/multiplayer.js?v=0.0.22';

function service() {
  const instance = new MultiplayerService({ url: 'x', anonKey: 'y' });
  instance.user = { id: 'user-1' };
  return instance;
}

test('a presença distingue jogo contra o computador e jogo local', () => {
  const multiplayer = service();
  assert.equal(multiplayer.normalisePresence({ nick: 'Lena', status: 'pc' }).status, 'pc');
  assert.equal(multiplayer.normalisePresence({ nick: 'Lena', status: 'local' }).status, 'local');
  assert.equal(multiplayer.normalisePresence({ nick: 'Lena', status: 'desconhecido' }).status, 'free');
});

test('a lista de presença inclui todas as ligações activas e conserva o identificador real', () => {
  const multiplayer = service();
  multiplayer.lobbyChannel = {
    presenceState: () => ({
      'connection-a': [{
        connection_id: 'connection-a', user_id: 'user-a', nick: 'A', status: 'free', seen_at: new Date().toISOString(),
      }],
      'connection-b': [{
        connection_id: 'connection-b', user_id: 'user-b', nick: 'B', status: 'pc', seen_at: new Date().toISOString(),
      }],
    }),
  };
  const players = multiplayer.presencePlayers();
  assert.equal(players.length, 2);
  assert.deepEqual(new Set(players.map((player) => player.connection_id)), new Set(['connection-a', 'connection-b']));
});

test('a aplicação anuncia imediatamente os modos PC e local', async () => {
  const source = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.match(source, /if \(app\.mode === 'pc'\) \{\s*status = 'pc';/s);
  assert.match(source, /else if \(app\.mode === 'local'\) \{\s*status = 'local';/s);
  assert.match(source, /async function startPcGame\(\)[\s\S]*?renderGame\(\);\s*syncPresence\(\);/);
  assert.match(source, /function startLocalGame\(\)[\s\S]*?renderGame\(\);\s*syncPresence\(\);/);
});


test('a presença do jogador contra o computador inclui o banco observável', async () => {
  const source = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.match(source, /if \(app\.mode === 'pc'\) \{\s*status = 'pc';\s*bankId = app\.room\?\.id/s);
  assert.match(source, /case 'pc': return t\('statusPc', \{ bank \}\)/);
});
