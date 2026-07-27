import test from 'node:test';
import assert from 'node:assert/strict';
import { ENDGAME_DRILLS, createEndgameDrillGame, validateEndgameDrills } from '../js/drills.js';
import { applyMove, legalMoves, SOUTH, NORTH } from '../js/engine.js?v=1.0.9';

test('existem oito Drills públicos de fim de jogo', () => {
  assert.equal(ENDGAME_DRILLS.length, 8);
  assert.equal(validateEndgameDrills(), true);
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


test('cada Drill explica o desafio da posição aos jogadores inexperientes', () => {
  for (const drill of ENDGAME_DRILLS) {
    assert.match(drill.challengeKey, /^drill0[1-8]Challenge$/);
  }
});


test('as soluções terminam imediatamente ao chegar ao final 1–1', () => {
  assert.deepEqual(ENDGAME_DRILLS.map((drill) => drill.solution.length), [29, 27, 25, 21, 17, 13, 7, 1]);
});
