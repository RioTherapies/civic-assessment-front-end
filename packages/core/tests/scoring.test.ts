import { describe, expect, it } from 'vitest';
import {
  civicActions,
  pagesData,
  promptData,
  scoreAssessment,
  calculateRawScores,
  calculateScores,
  calculateTypes,
  DIMENSIONS,
  type AssessmentAnswers,
} from '../src/index.js';

describe('scoreAssessment', () => {
  it('returns scores, types, and recommended actions for a full answer set', () => {
    const answers = Object.fromEntries(
      Object.keys(promptData).map((code) => [code, 3])
    ) as Record<string, 3>;

    const result = scoreAssessment(answers);

    expect(result.scores).toBeDefined();
    expect(DIMENSIONS.every((d) => typeof result.scores[d] === 'number')).toBe(true);
    expect(result.types.length).toBeGreaterThan(0);
    expect(result.types.length).toBeLessThanOrEqual(3);
    expect(result.recommendedActions.length).toBe(27);
    expect(result.recommendedActions[0]).toHaveProperty('distance');
  });

  it('includes mandatory civic actions in recommendations', () => {
    const answers = Object.fromEntries(
      Object.keys(promptData).map((code) => [code, 4])
    );

    const result = scoreAssessment(answers);
    const names = result.recommendedActions.map((a) => a.name);

    expect(names).toContain('Vote');
    expect(names).toContain('Attend marches/protests');
    expect(names).toContain('Attend a local town hall');
  });

  it('sorts recommendations by euclidean distance', () => {
    const answers = Object.fromEntries(
      Object.keys(promptData).map((code, i) => [code, ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5])
    );

    const result = scoreAssessment(answers);
    const mandatory = new Set([
      'Attend marches/protests',
      'Attend a local town hall',
      'Vote',
    ]);

    const nonMandatory = result.recommendedActions.filter((a) => !mandatory.has(a.name));
    for (let i = 1; i < nonMandatory.length; i++) {
      expect(nonMandatory[i].distance).toBeGreaterThanOrEqual(nonMandatory[i - 1].distance - 0.0001);
    }
  });
});

describe('data integrity', () => {
  it('has 54 prompts across 6 pages', () => {
    expect(Object.keys(promptData)).toHaveLength(54);
    expect(pagesData).toHaveLength(6);
    expect(pagesData.flat()).toHaveLength(54);
  });

  it('has civic actions with all dimensions', () => {
    expect(civicActions.length).toBeGreaterThan(90);
    for (const action of civicActions) {
      for (const dim of DIMENSIONS) {
        expect(typeof action[dim]).toBe('number');
      }
    }
  });
});

describe('calculateTypes', () => {
  it('returns at least one type when all scores are equal', () => {
    const scores = calculateScores(
      Object.fromEntries(Object.keys(promptData).map((code) => [code, 3])) as never
    );
    const types = calculateTypes(scores);
    expect(types.length).toBeGreaterThan(0);
  });

  it('caps types at maxTypes when many dimensions exceed the threshold', () => {
    const scores = { R: 1, I: 1, A: 1, S: -1, E: -1, C: -1 };
    expect(calculateTypes(scores, 1)).toHaveLength(1);
  });
});

describe('calculateRawScores', () => {
  it('skips undefined answer values', () => {
    const answers = { R1: 3, R2: undefined } as AssessmentAnswers;
    expect(calculateRawScores(answers).R).toBe(3);
  });
});
