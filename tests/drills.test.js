import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRILL_LEVELS,
  ENDGAME_DRILLS,
  createEndgameDrillGame,
  validateEndgameDrills,
} from '../js/drills.js';
import { applyMove, legalMoves, SOUTH, NORTH } from '../js/engine.js?v=1.0.12';

test('existem catorze Drills públicos distribuídos por três níveis', () => {
  assert.equal(ENDGAME_DRILLS.length, 14);
  assert.deepEqual(DRILL_LEVELS.map((level) => level.id), ['beginner', 'medium', 'advanced']);
  assert.deepEqual(
    DRILL_LEVELS.map((level) => ENDGAME_DRILLS.filter((drill) => drill.level === level.id).length),
    [5, 5, 4],
  );
  assert.equal(validateEndgameDrills(), true);
});

test('os casos canónicos 3–2, 4–3, 5–3, 5–4, 6–3 e 6–4 estão incluídos', () => {
  const expected = new Map([
    ['3–2', [3, 2, 'beginner']],
    ['4–3', [4, 3, 'beginner']],
    ['5–3', [5, 3, 'beginner']],
    ['5–4', [5, 4, 'medium']],
    ['6–3', [6, 3, 'medium']],
    ['6–4', [6, 4, 'medium']],
  ]);

  for (const [pattern, [southSeeds, northSeeds, level]] of expected) {
    const drill = ENDGAME_DRILLS.find((item) => item.pattern === pattern);
    assert.ok(drill, pattern);
    assert.equal(drill.level, level, pattern);
    assert.equal(drill.board.slice(0, 6).reduce((sum, seeds) => sum + seeds, 0), southSeeds, pattern);
    assert.equal(drill.board.slice(6).reduce((sum, seeds) => sum + seeds, 0), northSeeds, pattern);
  }
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

test('cada Drill apresenta uma explicação própria para jogadores inexperientes', () => {
  for (const drill of ENDGAME_DRILLS) {
    assert.match(drill.challengeKey, /^drill(?:0[1-8]|Case(?:32|43|53|54|63|64))Challenge$/);
  }
});

test('os novos casos canónicos têm linhas automáticas completas', () => {
  const lengths = Object.fromEntries(
    ENDGAME_DRILLS.filter((drill) => drill.pattern).map((drill) => [drill.pattern, drill.solution.length]),
  );
  assert.deepEqual(lengths, {
    '3–2': 1,
    '4–3': 9,
    '5–3': 7,
    '5–4': 5,
    '6–3': 5,
    '6–4': 14,
  });
});
