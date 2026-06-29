export const DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

export type Dimension = (typeof DIMENSIONS)[number];

/**
 * ID for one assessment question.
 *
 * Format: `{dimension}{number}` — e.g. `"R7"` is the 7th Builder question.
 * Look up the question text in `promptData[code]`.
 *
 * There are 54 codes total: 9 questions × 6 dimensions (R, I, A, S, E, C).
 */
export type PromptCode =
  | `R${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `I${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `A${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `S${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `E${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `C${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

/** Maps each question ID to the activity text shown in the quiz. */
export type PromptData = Record<PromptCode, string>;

/** 1 = strongly dislike … 5 = strongly like */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

/** User responses keyed by question ID. Filled in as they take the quiz. */
export type AssessmentAnswers = Partial<Record<PromptCode, LikertValue>>;

export type DimensionScores = Record<Dimension, number>;

export interface ActivismTypeData {
  id: Dimension;
  title: string;
  color: string;
  resultTitle: string;
  description: string;
  resultText: string;
}

export interface CivicAction {
  name: string;
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
  E_I: number;
  Dis: number;
  Time: number;
  desc: string;
}

export interface ScoredCivicAction extends CivicAction {
  id: string;
  distance: number;
}

export interface AssessmentResult {
  scores: DimensionScores;
  types: Dimension[];
  recommendedActions: ScoredCivicAction[];
}

export interface ScoreAssessmentOptions {
  maxTypes?: number;
  maxRecommendedActions?: number;
}
