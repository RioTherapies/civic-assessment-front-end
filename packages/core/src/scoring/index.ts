import type {
  AssessmentAnswers,
  AssessmentResult,
  ScoreAssessmentOptions,
} from '../types.js';
import { recommendActions } from './recommendations.js';
import { calculateScores } from './scores.js';
import { calculateTypes } from './types.js';

export function scoreAssessment(
  answers: AssessmentAnswers,
  options: ScoreAssessmentOptions = {}
): AssessmentResult {
  const { maxTypes = 3, maxRecommendedActions = 27 } = options;
  const scores = calculateScores(answers);
  const types = calculateTypes(scores, maxTypes);
  const recommendedActions = recommendActions(scores, maxRecommendedActions);

  return { scores, types, recommendedActions };
}

export { calculateEuclideanDistance } from './distance.js';
export { calculateRawScores, calculateScores, normalizeScores } from './scores.js';
export { calculateTypes } from './types.js';
export { recommendActions } from './recommendations.js';
