# CLAUDE.md

## Project Overview

IT Maturity Assessment Quiz — a React widget that scores IT department maturity across three levels (Reactive, Structured, Optimized) and submits results to HubSpot CRM. Deployed both as a standalone React app and as a Webflow Code Component.

## Tech Stack

- **React 18+** with TypeScript (strict mode)
- **Vite** for dev server and builds
- **Tailwind CSS 4** for styling
- **html2canvas** for screenshot downloads
- **@webflow/react** for Code Component integration

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Type-check + production build
- `npm run build:lib` — Build library bundle for Webflow (ESM + UMD)
- `npm run build:css` — Process and flatten Tailwind CSS
- `npm run preview` — Preview production build

## Project Structure

```
src/
├── components/
│   ├── Quiz.tsx                    # Local dev wrapper
│   ├── Quiz.core.tsx               # Main quiz logic (shared core)
│   ├── ITMaturityQuiz.webflow.tsx  # Webflow Code Component entry
│   ├── OnboardingScreen.tsx        # Intro screen
│   ├── MaturityVisualization.tsx   # SVG maturity level visualization
│   └── GoalRecommendations.tsx     # Goal-based recommendations
├── hooks/
│   └── useQuizLogic.ts            # Quiz state management hook
├── utils/
│   ├── hubspot.ts                 # HubSpot Forms API integration
│   └── quizStorage.ts            # localStorage persistence (30-day expiry)
├── styles/
│   └── tokens.ts                 # Design tokens (colors, spacing)
├── App.tsx                        # App entry point
└── index.tsx                      # React DOM render
```

## Architecture

- **Dual build targets**: `vite.config.ts` for standalone app, `vite.config.lib.ts` for Webflow library bundle
- **Component naming**: `.core.tsx` = shared logic, `.webflow.tsx` = Webflow entry point
- **State management**: React hooks + localStorage persistence via `quizStorage.ts`
- **Event system**: Dispatches custom `unlockTOC` window event for Webflow TOC integration
- **CRM integration**: HubSpot Forms API submission with business email validation (rejects free email domains)

## Code Conventions

- Functional components with hooks; no class components
- Named exports for components
- Explicit `interface` definitions for props
- Inline styles for dynamic/calculated values; Tailwind for utilities
- Design tokens centralized in `src/styles/tokens.ts`
- TypeScript strict mode: no unused locals/parameters, no fallthrough cases

## Key Configuration

- `tsconfig.json` — ES2020 target, strict, react-jsx automatic runtime
- `tsconfig.lib.json` — Library build TS config
- `tailwind.config.js` — Custom color palette (primary purple: #9966FF), Inter font
- HubSpot portal/form IDs configured via `HUBSPOT_CONFIG` in `hubspot.ts`
- `.env` — Contains `WEBFLOW_WORKSPACE_API_TOKEN` (do not commit)
