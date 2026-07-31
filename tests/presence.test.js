import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MultiplayerService } from '../js/multiplayer.js?v=1.0.12';

function service() {
  const instance = new MultiplayerService({ url: 'x', anonKey: 'y' });
  instance.user = { id: 'user-1', is_anonymous: true };
  return instance;
}

test('a presença distingue treino, jogo local, banco e consulta', () => {
  const multiplayer = service();
  assert.equal(multiplayer.normalisePresence({ status: 'pc' }).status, 'pc');
  assert.equal(multiplayer.normalisePresence({ status: 'local' }).status, 'local');
  assert.equal(multiplayer.normalisePresence({ status: 'watching' }).status, 'watching');
  assert.equal(multiplayer.normalisePresence({ status: 'desconhecido' }).status, 'free');
});

test('a lista global conserva uma entrada por ligação activa', () => {
  const multiplayer = service();
  multiplayer.lobbyChannel = {
    presenceState: () => ({
      a: [{ connection_id: 'a', user_id: 'u1', nick: 'A', status: 'free', seen_at: new Date().toISOString() }],
      b: [{ connection_id: 'b', user_id: 'u2', nick: 'B', status: 'pc', seen_at: new Date().toISOString() }],
    }),
  };
  assert.deepEqual(new Set(multiplayer.presencePlayers().map((p) => p.connection_id)), new Set(['a', 'b']));
});

test('espectadores anónimos são numerados por ligação', () => {
  const multiplayer = service();
  multiplayer.roomChannel = {
    presenceState: () => ({
      z: [{ connection_id: 'z', nick: 'Anónimo', registered: false, role: 'spectator' }],
      a: [{ connection_id: 'a', nick: 'Anónimo', registered: false, role: 'spectator' }],
      p: [{ connection_id: 'p', nick: 'Lena', registered: true, role: 'spectator' }],
    }),
  };
  const viewers = multiplayer.roomPresenceViewers();
  assert.equal(viewers.find((v) => v.connection_id === 'a').display_nick, 'Anónimo 01');
  assert.equal(viewers.find((v) => v.connection_id === 'z').display_nick, 'Anónimo 02');
  assert.equal(viewers.find((v) => v.connection_id === 'p').display_nick, 'Lena');
});

test('o treino não publica identificador de banco', async () => {
  const source = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.match(source, /if \(app\.mode === 'pc' \|\| app\.mode === 'calibration'\) \{\s*status = 'pc';/s);
  assert.doesNotMatch(source, /status = 'pc';\s*bankId =/s);
});


test('a presença conserva o estado compacto de um jogo contra o computador', () => {
  const multiplayer = service();
  const pcState = {
    id: 'pc-1',
    version: 3,
    session: { game: { board: Array(12).fill(4), scores: { south: 0, north: 0 }, currentPlayer: 'south', status: 'playing' } },
  };
  const presence = multiplayer.normalisePresence({
    status: 'pc',
    pc_game_id: 'pc-1',
    pc_level: 'master',
    pc_state_version: 3,
    pc_state: pcState,
  });
  assert.equal(presence.pc_game_id, 'pc-1');
  assert.equal(presence.pc_level, 'master');
  assert.equal(presence.pc_state_version, 3);
  assert.deepEqual(presence.pc_state, pcState);
});

test('o estado Drill é publicado como Drill e não como livre', () => {
  const multiplayer = service();
  assert.equal(multiplayer.normalisePresence({ status: 'drill' }).status, 'drill');
});
