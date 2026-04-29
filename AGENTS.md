# Neura — Agent Guidance

## Key Commands

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # TypeScript check + Vite build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run build:waves-on   # Build with wave animation
npm run build:waves-off  # Build without wave animation
```

## Build Order

`npm run build` runs `tsc -b` before Vite build. Always run build to catch type errors.

## Path Alias

`@/` maps to `src/` — use this for imports (e.g., `@/app/store`).

## Architecture

- **Entry**: `src/main.tsx` — sets up Redux + PersistGate + Router
- **Routing**: `src/app/router/` — React Router setup
- **State**: `src/app/store.ts` — Redux Toolkit + redux-persist
- **Features**: `src/features/migraine/` — migraine tracking feature
- **Components**: `src/shared/components/` — shared UI components
- **Styles**: `src/styles/index.css` — CSS design tokens (`:root`)

## Special Notes

- **Wave animation**: Controlled by `VITE_WAVE_ANIMATED` env var (default: `true` in `.env`)
- **No tests**: No test framework configured. Do not add tests unless explicitly requested.
- **Design guide**: `README.md` is the source of truth for visual/design decisions — it's a detailed style guide, not a project intro.

## Pre-commit Checklist

Before committing, verify:
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds (typecheck + build)

## Important Constraints

- The app is designed for people with active migraine — prioritize low cognitive load, avoid high contrast, don't add new visual elements
- Only use colors defined in `README.md` design tokens
- Keep the "I have migraine" CTA as the most prominent element