import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRILL_LEVELS,
  ENDGAME_DRILLS,
  createEndgameDrillGame,
  validateEndgameDrills,
} from '../js/drills.js';
import { applyMove, legalMoves, SOUTH, NORTH } from '../js/engine.js?v=1.0.16';

test('existem vinte Drills públicos distribuídos por três níveis', () => {
  assert.equal(ENDGAME_DRILLS.length, 20);
  assert.deepEqual(DRILL_LEVELS.map((level) => level.id), ['beginner', 'medium', 'advanced']);
  assert.deepEqual(
    DRILL_LEVELS.map((level) => ENDGAME_DRILLS.filter((drill) => drill.level === level.id).length),
    [5, 5, 10],
  );
  assert.equal(validateEndgameDrills(), true);
});

test('o nível avançado contém finais 6–3, 6–4, 6–5, 5–4, 5–3, 4–3 e variantes adicionais', () => {
  const advanced = ENDGAME_DRILLS.filter((drill) => drill.level === 'advanced');
  const patterns = new Set(advanced.map((drill) => drill.pattern));
  for (const pattern of ['6–3', '6–4', '6–5', '5–4', '5–3', '4–3', '5–5', '4–4', '7–4', '7–5']) {
    assert.ok(patterns.has(pattern), pattern);
  }
});

test('os finais avançados são posições distintas e não derivações repetidas do mesmo tabuleiro', () => {
  const advanced = ENDGAME_DRILLS.filter((drill) => drill.level === 'advanced');
  const boards = advanced.map((drill) => drill.board.join(','));
  assert.equal(new Set(boards).size, advanced.length);
  assert.ok(advanced.every((drill) => drill.solution.length >= 20));
});

test('cada Drill começa com exactamente 48 sementes contabilizadas', () => {
  for (const drill of ENDGAME_DRILLS) {
    const total = drill.board.reduce((sum, seeds) => sum + seeds, 0)
      + drill.scores[SOUTH] + drill.scores[NORTH];
    assert.equal(total, 48, drill.id);
    assert.deepEqual(drill.target, { south: 25, north: 23 });
  }
});

test('a linha de referência de cada Drill termina exactamente em 25–23', () => {
  for (const drill of ENDGAME_DRILLS) {
    let game = createEndgameDrillGame(drill);
    for (const pit of drill.solution) {
      assert.equal(game.status, 'playing', `${drill.id}: terminou antes da linha`);
      assert.ok(legalMoves(game).includes(pit), `${drill.id}: casa ${pit} não é legal`);
      game = applyMove(game, pit);
    }
    assert.equal(game.status, 'finished', `${drill.id}: linha não terminou`);
    assert.equal(game.scores[SOUTH], 25, `${drill.id}: Sul não terminou com 25`);
    assert.equal(game.scores[NORTH], 23, `${drill.id}: Norte não terminou com 23`);
    assert.equal(game.lastMove.oneSeedEach, true, `${drill.id}: não terminou no final 1–1`);
    assert.match(game.reason, /uma semente em cada campo/, `${drill.id}: motivo final incorrecto`);
  }
});

test('cada Drill apresenta uma explicação própria', () => {
  const keys = ENDGAME_DRILLS.map((drill) => drill.challengeKey);
  assert.equal(new Set(keys).size, keys.length);
  for (const key of keys) assert.match(key, /^drill(?:0[1-8]|Case(?:32|43|53|54|63|64)|Advanced(?:63|64|65|54|53|43|55|44|74|75))Challenge$/);
});
