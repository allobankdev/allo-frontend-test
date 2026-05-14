# Allo SpaceX — Frontend Test

A small Vue 3 application that lists SpaceX rockets, lets the user filter and add new entries, and shows a detail page for each rocket.

## Tech Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Framework | **Vue 3 (Composition API)** | Reactive primitives, `<script setup>` keeps components terse |
| Language | **TypeScript** | Type safety on the `Rocket` model and store contracts |
| Build tool | **Vite** | Fast HMR, native ESM |
| UI library | **Vuetify 3** | Production-ready Material components, responsive grid out of the box |
| Routing | **Vue Router + `unplugin-vue-router`** | File-based routes from `src/pages/*` keep wiring zero-config |
| State | **Pinia** | Official Vue store; less boilerplate than Vuex |

## Features

- ✅ Rocket list with image, name, description
- ✅ Search filter (by name or description)
- ✅ Add new rocket via dialog form (kept client-side; SpaceX API is read-only)
- ✅ Rocket detail page (image, name, description, cost per launch, country, first flight, status)
- ✅ UI states: Loading, Error+Retry, Success — separate for list and detail
- ✅ Responsive grid (1 / 2 / 3 / 4 columns at xs / sm / md / lg)
- ✅ List cache: navigating Detail → Back doesn't re-fetch

## Project Structure

```
src/
├── components/
│   ├── AddRocketDialog.vue  # Modal form to add a rocket (client-side)
│   ├── ErrorState.vue       # Reusable error block with retry emit
│   ├── LoadingState.vue     # Reusable centered spinner
│   └── RocketCard.vue       # List item card
├── pages/
│   ├── index.vue            # Rocket list page (route: /)
│   └── rockets/[id].vue     # Rocket detail page (route: /rockets/:id)
├── stores/
│   └── rocket.ts            # Pinia store: fetch, filter, add, detail
├── plugins/                 # Vuetify, Pinia, Router registration
├── router/                  # Vue Router setup with auto-routes
└── styles/                  # Vuetify SCSS settings
```

## How to Run

Requirements: Node.js 22+, npm.

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Notes

**Separation of list state and detail state.** The store keeps `loading/error` for the list separate from `detailLoading/detailError` for the detail page. Sharing them caused stale data flashes and conflicting spinners when navigating between pages.

**Locally-added rockets resolve without an API call.** The detail page first checks the in-memory list before hitting the SpaceX API. Without this, a rocket added through the dialog (which has a client-generated UUID, not a real SpaceX ID) would always 404 on detail.

**Filter re-applied after add.** The original `addRocket` pushed to both `rockets` and `filteredRockets` unconditionally, so a new rocket would show up even if it didn't match the current search query. The fix re-runs the filter after every mutation.

**Error logging.** `catch (err)` actually logs `err` to the console — the user message stays friendly, but the dev console keeps the real diagnostic.

**No external image guard.** Both list cards and the detail image fall back to a placeholder if `flickr_images` is empty (common for user-added rockets that skip the image URL).

## API

[SpaceX REST API v4](https://github.com/r-spacex/SpaceX-API):

- `GET /v4/rockets` — list of rockets
- `GET /v4/rockets/:id` — single rocket

No auth required. Read-only — the "Add Rocket" feature is client-side only.
