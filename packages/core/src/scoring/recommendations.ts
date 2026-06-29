import { MANDATORY_ACTION_NAMES } from '../data/constants.js';
import { civicActions } from '../data/civic-actions.js';
import type { DimensionScores, ScoredCivicAction } from '../types.js';
import { calculateEuclideanDistance } from './distance.js';

export function recommendActions(
  scores: DimensionScores,
  maxActions = 27
): ScoredCivicAction[] {
  const scoredActions: ScoredCivicAction[] = civicActions.map((action) => ({
    ...action,
    id: action.name,
    distance: calculateEuclideanDistance(scores, action),
  }));

  const mandatoryNames = new Set<string>(MANDATORY_ACTION_NAMES);
  const mandatoryActions = scoredActions.filter((a) => mandatoryNames.has(a.name));
  const otherActions = scoredActions.filter((a) => !mandatoryNames.has(a.name));

  otherActions.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) < 0.0001) {
      return a.name.localeCompare(b.name);
    }
    return a.distance - b.distance;
  });

  const finalList = [
    ...otherActions.slice(0, 7),
    ...mandatoryActions,
    ...otherActions.slice(7),
  ];

  return finalList.slice(0, maxActions);
}
