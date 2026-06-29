import { DIMENSIONS } from '../types.js';
import type { CivicAction, Dimension, DimensionScores } from '../types.js';

export function calculateEuclideanDistance(
  userScores: DimensionScores,
  action: Pick<CivicAction, Dimension>
): number {
  let sumOfSquares = 0;
  for (const dim of DIMENSIONS) {
    sumOfSquares += Math.pow(userScores[dim] - action[dim], 2);
  }
  return Math.sqrt(sumOfSquares);
}
