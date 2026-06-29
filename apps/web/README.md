# @rio/civic-assessment-web

React web app for the RIO Civic Assessment — the interactive quiz and results UI.

This is the user-facing front end. It renders the multi-page assessment flow, radar chart, activism type results, and civic action recommendations. All scoring and content come from [`@rio/civic-assessment`](../../packages/core/README.md); this app only handles presentation and user interaction.

## Stack

- **React 19** — UI components and state
- **Vite** — dev server and production build
- **Tailwind CSS v4** — styling
- **lucide-react** — icons (kept here, not in the core package)
- **@rio/civic-assessment** — scoring engine and quiz data (workspace dependency)

## Project layout

```
apps/web/
├── src/
│   ├── App.tsx       # Full assessment UI (quiz, results, actions)
│   ├── main.tsx      # React entry point
│   └── index.css     # Tailwind imports
├── index.html
└── vite.config.ts
```

## Scripts

Run from the **repo root** (recommended) or from this directory:

```bash
npm run dev -w @rio/civic-assessment-web     # http://localhost:5173
npm run build -w @rio/civic-assessment-web   # output to dist/
npm run preview -w @rio/civic-assessment-web  # preview production build
npm run typecheck -w @rio/civic-assessment-web
```

Build the core package first if you change scoring or data:

```bash
npm run build -w @rio/civic-assessment
```

Or build everything from the root:

```bash
npm run build
```

## Relationship to core

The app imports `scoreAssessment`, `promptData`, `pagesData`, and related types from `@rio/civic-assessment`. UI-only concerns — icons, layout, charts, navigation — live in `App.tsx` and are not part of the core package.
