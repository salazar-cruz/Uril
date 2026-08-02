import test from 'node:test';
import assert from 'node:assert/strict';
import { moveTaunt, openingTaunt, replyToPlayer } from '../js/ai-chat.js?v=1.0.15';
import { NORTH, SOUTH, createGame } from '../js/engine.js?v=1.0.15';

test('o computador inicia o chat com uma provocação contextual', () => {
  const message = openingTaunt({ language: 'pt', level: 'grandmaster', firstPlayer: SOUTH });
  assert.ok(message.length > 20);
  assert.match(message, /nabo|campeão|asneira|vantagem/i);
});

test('a resposta ao jogador reconhece provocações e conversa', () => {
  const game = createGame({ firstPlayer: SOUTH });
  game.scores = { [SOUTH]: 4, [NORTH]: 10 };
  const message = replyToPlayer({ language: 'pt', text: 'Seu idiota, eu vou ganhar!', game, level: 'master' });
  assert.ok(message.length > 20);
  assert.match(message, /insultos|perder|nabo|sementes|confiança|jogar/i);
});

test('a IA goza com um Frouxo cometido pelo jogador', () => {
  const before = createGame({ firstPlayer: SOUTH });
  const after = structuredClone(before);
  after.currentPlayer = NORTH;
  after.lastMove = { player: SOUTH, capturedSeeds: 12, grandSlam: true, frouxo: true };
  after.status = 'finished';
  after.winner = NORTH;
  after.scores = { [SOUTH]: 12, [NORTH]: 36 };
  const message = moveTaunt({ language: 'pt', actor: SOUTH, beforeGame: before, afterGame: after, level: 'master' });
  assert.match(message, /Frouxo|nabo|idiota/i);
});

test('a IA comenta uma colheita própria sem depender de serviços externos', () => {
  const before = createGame({ firstPlayer: NORTH });
  const after = structuredClone(before);
  after.currentPlayer = SOUTH;
  after.lastMove = { player: NORTH, capturedSeeds: 7, grandSlam: false, frouxo: false };
  after.scores = { [SOUTH]: 0, [NORTH]: 7 };
  const message = moveTaunt({ language: 'pt', actor: NORTH, beforeGame: before, afterGame: after, level: 'grandmaster', analysis: { value: 300 } });
  assert.ok(message.length > 20);
  assert.match(message, /sementes|banquete|doações|fornecedor/i);
});
