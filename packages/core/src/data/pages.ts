import type { PromptCode } from '../types.js';

/**
 * Quiz pagination: which questions appear on each page, in display order.
 *
 * - Outer array = pages (6 total)
 * - Inner array = 9 question IDs shown on that page
 * - Every question ID appears exactly once across all pages
 * - Dimensions are interleaved so users don't get long runs of one type
 *
 * The UI uses `pagesData[pageIndex]` to know what to render, then looks up
 * each question's text with `promptData[code]`.
 */
export const pagesData: PromptCode[][] = [
  ['R7', 'I7', 'A9', 'S1', 'E6', 'C4', 'A3', 'E2', 'C3'],
  ['R8', 'I4', 'A2', 'S5', 'E8', 'C7', 'R4', 'R5', 'I5'],
  ['R9', 'I3', 'A4', 'S2', 'E9', 'C9', 'S4', 'E7', 'C2'],
  ['R3', 'I2', 'A1', 'S8', 'E3', 'C8', 'R2', 'I1', 'S6'],
  ['R6', 'I8', 'A8', 'S3', 'E4', 'C5', 'A7', 'A5', 'E5'],
  ['R1', 'I9', 'A6', 'S7', 'E1', 'C1', 'I6', 'S9', 'C6']
];
