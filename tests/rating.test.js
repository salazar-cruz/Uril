import test from 'node:test';
import assert from 'node:assert/strict';
import {
  expectedScore,
  calculateElo,
  kFactor,
  initialEloFromCalibration,
  calibrationPerformance,
} from '../js/rating.js?v=1.0.4';

test('dois jogadores com o mesmo Elo têm expectativa de 50%', () => {
  assert.equal(expectedScore(1200, 1200), 0.5);
});

test('uma vitória contra adversário igual aumenta o Elo', () => {
  const result = calculateElo({ playerElo: 1200, opponentElo: 1200, score: 1, ratedGames: 12 });
  assert.equal(result.k, 32);
  assert.equal(result.delta, 16);
  assert.equal(result.after, 1216);
});

test('jogadores provisórios recebem factor de ajuste 64', () => {
  assert.equal(kFactor({ elo: 1400, ratedGames: 2, provisional: true }), 64);
});

test('a calibração calcula um Elo inicial limitado', () => {
  assert.equal(calibrationPerformance('amateur', 'win'), 1400);
  const elo = initialEloFromCalibration([
    { level: 'apprentice', result: 'win' },
    { level: 'amateur', result: 'draw' },
    { level: 'master', result: 'loss' },
  ]);
  assert.equal(elo, 1200);
});
