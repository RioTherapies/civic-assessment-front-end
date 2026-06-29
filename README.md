# RIO Civic Assessment

Monorepo for the RIO Civic Assessment — converted from a Gemini-hosted React app into a proper Node package and deployable web app.

## Structure

| Path | Package | README |
|------|---------|--------|
| `packages/core/` | `@rio/civic-assessment` — scoring engine + data (framework-agnostic) | [packages/core/README.md](packages/core/README.md) |
| `apps/web/` | `@rio/civic-assessment-web` — Vite + React + Tailwind UI | [apps/web/README.md](apps/web/README.md) |

## Quick start

```bash
npm install
npm run build
npm run dev
```

Open http://localhost:5173

## Core package usage

```ts
import { scoreAssessment, promptData, pagesData } from '@rio/civic-assessment';

const answers = { R1: 4, R2: 5 /* ...all 54 prompts */ };
const { scores, types, recommendedActions } = scoreAssessment(answers);
```

### API

| Export | Description |
|--------|-------------|
| `scoreAssessment(answers)` | Full assessment: scores, types, and recommended actions |
| `calculateScores(answers)` | Normalized dimension scores |
| `calculateTypes(scores)` | Top activism type(s) |
| `recommendActions(scores)` | Ranked civic actions by profile match |
| `promptData`, `pagesData` | Quiz questions and page layout |
| `civicActions` | Full civic action directory |
| `activismTypes` | Type descriptions (no UI icons) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the web app |
| `npm run build` | Build core package + web app |
| `npm test` | Run core package tests |

## Publishing

To publish the core package to npm:

```bash
cd packages/core
npm publish --access public
```

## License

Content © Robert Ortega, Ph.D. — see original assessment for attribution.
