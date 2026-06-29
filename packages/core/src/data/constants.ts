import type { Dimension } from '../types.js';

export const dimensionNames: Record<Dimension, string> = {
  R: "Builder", I: "Analyst", A: "Storyteller", S: "Connector", E: "Mobilizer", C: "Organizer"
};

export const radarLabelsMap: Record<Dimension, string> = {
  R: "B", I: "A", A: "S", S: "C", E: "M", C: "O"
};

export const MANDATORY_ACTION_NAMES = [
  'Attend marches/protests',
  'Attend a local town hall',
  'Vote',
] as const;
