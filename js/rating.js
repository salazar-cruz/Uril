export const DEFAULT_ELO = 1200;
export const CALIBRATION_LEVELS = ['apprentice', 'amateur', 'master'];
export const AI_REFERENCE_ELO = Object.freeze({
  apprentice: 900,
  amateur: 1200,
  master: 1500,
  grandmaster: 1800,
});

export function expectedScore(playerElo, opponentElo) {
  const player = Number(playerElo) || DEFAULT_ELO;
  const opponent = Number(opponentElo) || DEFAULT_ELO;
  return 1 / (1 + 10 ** ((opponent - player) / 400));
}

export function kFactor({ elo = DEFAULT_ELO, ratedGames = 0, provisional = false } = {}) {
  if (provisional || Number(ratedGames) < 10) return 64;
  if (Number(elo) >= 2100) return 16;
  return 32;
}

export function calculateElo({ playerElo, opponentElo, score, ratedGames = 0, provisional = false }) {
  const current = Number(playerElo) || DEFAULT_ELO;
  const expected = expectedScore(current, opponentElo);
  const k = kFactor({ elo: current, ratedGames, provisional });
  const delta = Math.round(k * (Number(score) - expected));
  return {
    before: current,
    after: Math.max(100, current + delta),
    delta,
    expected,
    k,
  };
}

export function calibrationPerformance(level, result) {
  const reference = AI_REFERENCE_ELO[level] || DEFAULT_ELO;
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(reference + 400 * (score - 0.5));
}

export function initialEloFromCalibration(entries = []) {
  const valid = entries.filter((entry) => AI_REFERENCE_ELO[entry?.level]);
  if (!valid.length) return DEFAULT_ELO;
  const average = valid.reduce(
    (sum, entry) => sum + calibrationPerformance(entry.level, entry.result),
    0,
  ) / valid.length;
  return Math.max(700, Math.min(2200, Math.round(average / 10) * 10));
}

export function resultScore(result, side) {
  if (result === 'draw') return 0.5;
  return result === side ? 1 : 0;
}
