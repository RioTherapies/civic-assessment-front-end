import { DIMENSIONS } from '../types.js';
import type { AssessmentAnswers, Dimension, DimensionScores } from '../types.js';

export function calculateRawScores(answers: AssessmentAnswers): Record<Dimension, number> {
  const rawScores: Record<Dimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const [code, value] of Object.entries(answers)) {
    if (value === undefined) continue;
    const dimension = code.charAt(0) as Dimension;
    rawScores[dimension] += value;
  }

  return rawScores;
}

export function normalizeScores(rawScores: Record<Dimension, number>): DimensionScores {
  const processedScores = {} as DimensionScores;

  for (const dim of DIMENSIONS) {
    processedScores[dim] = (rawScores[dim] - 9) / 12;
  }

  return processedScores;
}

export function calculateScores(answers: AssessmentAnswers): DimensionScores {
  return normalizeScores(calculateRawScores(answers));
}
