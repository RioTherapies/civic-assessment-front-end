import { DIMENSIONS } from '../types.js';
import type { Dimension, DimensionScores } from '../types.js';

export function calculateTypes(
  scores: DimensionScores,
  maxTypes = 3
): Dimension[] {
  const scoresArray = DIMENSIONS.map((dim) => ({ dim, score: scores[dim] }));
  const rawVals = scoresArray.map((s) => s.score);
  const mean = rawVals.reduce((a, b) => a + b, 0) / DIMENSIONS.length;
  const sd = Math.sqrt(
    rawVals.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / DIMENSIONS.length
  );
  const threshold = mean + 0.5 * sd;

  scoresArray.sort((a, b) => b.score - a.score);

  let types = scoresArray.filter((s) => s.score > threshold).map((s) => s.dim);

  if (types.length === 0) {
    const topScore = scoresArray[0].score;
    types = scoresArray
      .filter((s) => s.score === topScore)
      .map((s) => s.dim)
      .slice(0, maxTypes);
  } else if (types.length > maxTypes) {
    types = types.slice(0, maxTypes);
  }

  return types;
}
