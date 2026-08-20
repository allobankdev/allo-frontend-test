# SpaceX Rockets — Allo Bank Frontend Technical Assignment

A responsive, accessible rocket catalog built with Vue 3, TypeScript, Vuetify 3, Pinia, and the [Launch Library 2 API v2.2.0](https://thespacedevs.com/llapi).

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |

---

## Getting Started

### 1. Clone the repository and switch to the feature branch

```bash
git checkout feat/allo-spacex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

The default value in `.env.example` is already correct for local development:

```
VITE_API_BASE_URL=https://lldev.thespacedevs.com/2.2.0
```

> **Note:** Use the `lldev.thespacedevs.com` development host. It serves the same data as the production host with a far more generous rate limit for anonymous users.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Type-check + production bundle |
| `npm run preview` | Serve the production bundle locally |
| `npm run type-check` | Run `vue-tsc --build --force` |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Run Prettier on `src/` |
| `npm run test:unit` | Run Vitest (single run) |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Project Structure

```
src/
├── assets/
│   └── rocket-placeholder.svg   # Shown when image_url is missing or fails
├── components/
│   ├── AppHeader.vue            # Sticky site header
│   ├── BaseButton.vue           # Typed reusable button (variant, loading, disabled)
│   ├── EmptyState.vue           # No-results / no-data state
│   ├── ErrorState.vue           # Error message + Retry button
│   ├── LoadingSkeleton.vue      # Pulsing card skeleton grid
│   ├── RocketCard.vue           # Clickable rocket card (RouterLink)
│   ├── RocketFilter.vue         # Search input — emits query, no API calls
│   └── RocketFormModal.vue      # Accessible modal for adding a local rocket
├── mappers/
│   └── rocket.mapper.ts         # LauncherConfigApi → Rocket domain model
├── router/
│   └── index.ts                 # Explicit Vue Router routes (lazy-loaded)
├── services/
│   └── rocket.service.ts        # Fetch wrapper for Launch Library 2 API
├── stores/
│   └── rocket.store.ts          # Pinia store (list + detail states, local rockets)
├── types/
│   ├── rocket-api.ts            # Raw API response shapes
│   └── rocket.ts                # Normalized Rocket domain model + NewRocketInput
├── utils/
│   └── formatters.ts            # formatText, formatDescription, formatCurrency, formatDate
└── views/
    ├── RocketListView.vue       # /rockets — list, filter, add rocket
    ├── RocketDetailView.vue     # /rockets/:id — detail screen
    └── NotFoundView.vue         # 404 catch-all
```

---

## Routing

| Path | Behaviour |
|------|-----------|
| `/` | Redirects to `/rockets` |
| `/rockets` | Rocket list screen |
| `/rockets/:id` | Rocket detail screen |
| `/*` | 404 Not Found page |

All views are **lazy-loaded** for smaller initial bundle size.

---

## Architectural Decisions

### API layer
- Uses the **native Fetch API** with `AbortController` for request cancellation.
- The service layer (`rocket.service.ts`) is the only module that knows about raw API field names.
- All responses are immediately normalized through `rocket.mapper.ts` before being stored.

### Data flow
```
API → rocket.service.ts → rocket.mapper.ts → Pinia store → Vue components
```
Components consume the normalized `Rocket` type and never reference raw API fields.

### Pinia store — request strategy
- **List fetch:** Guarded by an `initialized` flag. Once the list is loaded, navigating back to `/rockets` does **not** trigger another API request.
- **Detail fetch:** Checks `rockets[]` cache first. Only calls the detail API endpoint when the rocket is not already in the store (e.g., on a direct URL or page refresh).
- **Local rockets** are stored in Pinia only — they participate in filtering and routing but are never sent to the API.

### Local rocket creation
- IDs are generated with `crypto.randomUUID()` and prefixed with `local-`.
- The new rocket is **prepended** to the list so it appears immediately at the top.
- Data is **in-memory only** — it does not persist across page reloads. `localStorage` persistence was intentionally omitted per the assignment spec.
- No `POST`, `PATCH`, `PUT`, or `DELETE` requests are ever sent to the read-only API.

### Vuetify 3
- Vuetify was already installed and configured in the scaffold. It is used for the app shell (`v-app`, `v-main`). All product-specific UI (cards, filter, modal, detail screen) is built with **scoped CSS** and custom components for full control.

### Missing data handling
- `formatText` — returns `"Not available"` for null / undefined / empty.
- `formatDescription` — returns `"Description not available"` for missing descriptions.
- `formatCurrency` — parses string numbers from the API (e.g. `"62000000"`) and formats as `$62,000,000`.
- `formatDate` — parses `YYYY-MM-DD`, validates month/day bounds, and returns `"Not available"` for invalid or overflow dates.
- Images — replaced by a local SVG placeholder when `image_url` is null or the `<img>` fires an `error` event.

---

## Testing

Tests are written with **Vitest** and **Vue Test Utils**. They never call the real API.

```bash
npm run test:unit
```

Coverage areas:

| File | What is tested |
|------|---------------|
| `rocket.mapper.spec.ts` | All nullable fields, missing manufacturer |
| `formatters.spec.ts` | null / empty / invalid / valid inputs for all 4 formatters |
| `rocket.store.spec.ts` | fetchRockets (success/failure/dedup/force), addRocket, fetchRocketById (cache/API/local/error), clearErrors |
| `RocketFilter.spec.ts` | Label linkage, emit, clear button, no-fetch contract |
| `RocketListView.spec.ts` | Loading / error / success / empty states, client-side filter, retry |

---

## API Reference

**Base URL (dev):** `https://lldev.thespacedevs.com/2.2.0`

| Purpose | Endpoint |
|---------|----------|
| List SpaceX rockets | `GET /config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20` |
| Single rocket | `GET /config/launcher/:id/?mode=detailed` |

> API version `2.2.0` is used exactly. Migration to `2.3.0` was intentionally avoided (field names differ).

---

## Known Limitations

- **Local rockets are in-memory only.** Refreshing the browser will clear any locally-added rockets.
- **Rate limit:** The `lldev.thespacedevs.com` host allows far more than 15 req/hour, but the app makes at most 1–2 API calls per session (list once + detail only on direct URL access), so hitting the limit in normal use is not a concern.

---

## Recommended Git Commits

```bash
# Stage all new and modified files
git add .

# Commit
git commit -m "feat: implement SpaceX rocket catalog

- Rocket list screen with responsive grid and client-side search filter
- Rocket detail screen with cache-first store lookup and API fallback
- Add Rocket modal with validation (name required, URL format, non-negative cost)
- Pinia store with initialization guard preventing duplicate list requests
- Normalized domain model with mapper separating API types from UI types
- Loading/error/retry/empty states on all screens
- Placeholder SVG for missing or broken images
- Accessible components: labeled inputs, aria-live, focus management, Escape to close
- 54 unit tests covering mapper, formatters, store, filter, and list view
- ESLint clean, type-check passes, production build succeeds"
```
