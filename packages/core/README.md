# @rio/civic-assessment

Framework-agnostic scoring engine and data for the RIO Civic Assessment.

This package holds all quiz content, civic action data, and the logic that turns user answers into dimension scores, activism types, and recommended actions. It has no React or UI dependencies — the web app (and any future clients) import from here.

## What it contains

| Area | Location | Purpose |
|------|----------|---------|
| **Data** | `src/data/` | Quiz prompts, page layout, activism type copy, civic action directory, constants |
| **Scoring** | `src/scoring/` | Score calculation, type matching, action recommendations |
| **Types** | `src/types.ts` | Shared TypeScript types (`AssessmentAnswers`, `DimensionScores`, etc.) |

## Public API

```ts
import {
  scoreAssessment,
  calculateScores,
  calculateTypes,
  recommendActions,
  promptData,
  pagesData,
  civicActions,
  activismTypes,
} from '@rio/civic-assessment';

const answers = { R1: 4, R2: 5 /* ...all 54 prompts */ };
const { scores, types, recommendedActions } = scoreAssessment(answers);
```

| Export | Description |
|--------|-------------|
| `scoreAssessment(answers, options?)` | Full assessment: scores, types, and recommended actions |
| `calculateScores(answers)` | Normalized dimension scores (R, I, A, S, E, C) |
| `calculateTypes(scores, maxTypes?)` | Top activism type(s) by score |
| `recommendActions(scores, maxActions?)` | Ranked civic actions by profile match |
| `promptData` | 54 Likert-scale quiz questions keyed by prompt code |
| `pagesData` | Multi-page quiz flow configuration |
| `civicActions` | Full civic action directory with dimension weights |
| `activismTypes` | Type titles, descriptions, and result copy (no UI icons) |

## Scripts

Run from the **repo root** with `-w`, or from this directory directly:

```bash
npm run build -w @rio/civic-assessment   # compile to dist/ with tsup
npm run test -w @rio/civic-assessment    # vitest
npm run typecheck -w @rio/civic-assessment
```

## Publishing

This package is designed to be publishable as a standalone npm package:

```bash
cd packages/core
npm publish --access public
```

## License

Content © Robert Ortega, Ph.D. — see original assessment for attribution.
