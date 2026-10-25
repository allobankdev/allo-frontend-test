# Implementation Notes

This is my solution to the Allo Bank frontend technical assignment (see
`README.md` for the original brief). This file documents what was built and
why — it doesn't replace the original assignment doc.

## Stack

Built on the provided Vue 3 + Vuetify 3 + TypeScript + Vite scaffold
(file-based routing via `unplugin-vue-router`). One library was added:

- **Pinia** — state management, per the non-functional requirements.

Everything else (formatting, validation, HTTP calls) is hand-rolled with the
native `fetch` API and small utility functions, to keep the dependency
footprint minimal and the code easy to follow.

## Requirements checklist

**Functional**
- ✅ Rocket list with image, name, and description
- ✅ Filtering — search by name, filter by family (chips), "active only"
  toggle, plus sorting (name / cost / first flight)
- ✅ Add a new rocket (client-only, persisted to `localStorage` so it
  survives a refresh — the API itself is read-only, per the brief)
- ✅ Rocket detail screen with image, name, description, cost per launch,
  country, and first flight
- ✅ Missing data (`image_url`, `launch_cost`, `maiden_flight`) is handled
  gracefully everywhere it's displayed, with a "Not available" fallback
  and a placeholder icon in place of a missing image

**Non-functional**
- ✅ Launch Library 2 API (`lldev.thespacedevs.com/2.2.0`, `mode=detailed`,
  `limit=20`, exactly as specified in the brief)
- ✅ Routing — file-based routes (`/`, `/rockets/:id`, plus a `*` catch-all)
- ✅ State management — Pinia store (`src/stores/rockets.ts`)
- ✅ Lifecycles — `onMounted` for initial fetches, a `watch` on the route
  param for rocket-to-rocket navigation, `watchEffect` for the document
  title, `onErrorCaptured` as an app-level error boundary
- ✅ Componentized (list card, filter bar, add-rocket dialog, reusable
  error/empty states)
- ✅ UI states — Loading (skeletons), Fail/Retry (with a retry button),
  Success, plus an additional "not found" state for invalid rocket ids
- ✅ Responsive layout (mobile → desktop, Vuetify's grid breakpoints)

**Nice to have**
- ✅ Responsive design
- Extras: light/dark theme toggle (persisted), page transitions, a
  hard-refresh-safe detail page (falls back to the single-rocket endpoint),
  country code → name/flag formatting, currency/date formatting, a 404 page

## Architecture

```
src/
  types/rocket.ts          Domain types + the raw Launch Library 2 API shape
  services/rocketApi.ts    Thin fetch wrapper, typed errors (incl. 404)
  utils/                   mappers.ts, format.ts, countries.ts — pure functions
  stores/rockets.ts        Pinia store: fetch status, filters, custom rockets
  composables/             useDocumentTitle, useAppTheme
  components/
    rockets/                RocketCard, RocketFilterBar, RocketFormDialog
    common/                  ErrorState, EmptyState (shared UI states)
  pages/
    index.vue                Rocket list ("/")
    rockets/[id].vue          Rocket detail ("/rockets/:id")
    [...path].vue             404 catch-all
```

The raw API shape (snake_case, `launch_cost` as a numeric string, etc.) is
only known to `services/rocketApi.ts` and `utils/mappers.ts` — every
component works with a clean, camelCase `Rocket` type. If the upstream API
ever changes shape, only the mapper needs updating.

### Detail page resilience

The detail screen looks up the rocket in the store first (instant, no
network call, works for both API and custom rockets). If it's not there —
e.g. a hard refresh or a direct link opened before the list has ever loaded
— it falls back to `GET /config/launcher/:id/` for a single rocket. A 404
from that endpoint is treated as "rocket not found" (with a link back to the
list); any other failure shows the normal fail/retry state.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build
npm run lint       # eslint --fix
```

## Notes & assumptions

- The "filter" requirement was interpreted broadly: a name search, family
  chips, and an active-only toggle, plus sorting — since the brief didn't
  specify which fields, this covers the most useful ones.
- Added rockets are given ids like `custom-<timestamp>` to keep them
  distinct from API ids (which are plain numbers) — this is what lets the
  detail page tell "not found" apart from "this is a local rocket."
