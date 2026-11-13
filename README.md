# SpaceX Rockets: Allo Bank Frontend Technical Assignment

A small web app that lists SpaceX rockets from the [Launch Library 2 API](https://thespacedevs.com/llapi) and shows the details of each rocket. It has two screens: a **rocket list** and a **rocket detail**.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript |
| UI library | Vuetify 3 |
| Routing | Vue Router, file-based routing via `unplugin-vue-router` |
| State management | Pinia |
| Build tool | Vite |
| Lint | ESLint (`eslint-plugin-vue`, `typescript-eslint`) |

## Getting Started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

The app runs at <http://localhost:3000>.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run type-check` | Run `vue-tsc` |
| `npm run lint` | Run ESLint with auto-fix |

### Configuration (optional)

The API base URL defaults to the development host `https://lldev.thespacedevs.com/2.2.0`, so no setup is needed. To override it, create a `.env` file:

```
VITE_API_BASE_URL=https://lldev.thespacedevs.com/2.2.0
```

## Features

| Requirement | Implementation |
| --- | --- |
| Rocket list (image, name, description) | `pages/index.vue` renders a responsive grid of `RocketCard` |
| Filter rockets | Search by name or description (client-side) |
| Add a new rocket | `AddRocketDialog` with validation; stored in memory only (lost on refresh) |
| Rocket detail | `pages/rockets/[id].vue` shows image, name, description, cost per launch, country, and first flight |
| Missing data | Every field has a fallback (see below) |
| Routing | `/` (list) and `/rockets/:id` (detail), generated from `src/pages` |
| State management | Pinia store (`stores/rocketStore.ts`) |
| Lifecycles | Data is fetched in `onMounted`; the detail request is aborted in `onBeforeUnmount` |
| UI states | Loading (skeleton), Fail with a Retry button, Success. Used on both screens |
| Responsive design | Vuetify grid (1 to 4 columns depending on screen width) |

## Project Structure

```
src/
├── api/
│   └── rocketApi.ts            # fetchRockets, fetchRocketById
├── components/
│   ├── AddRocketDialog.vue     # form + validation to add a rocket
│   ├── ErrorState.vue          # error message + Retry button (reused on both screens)
│   ├── InfoRow.vue             # label/value row for the detail screen
│   ├── RocketCard.vue          # list item
│   ├── RocketCardSkeleton.vue  # loading placeholder for the list
│   ├── RocketFilter.vue        # search input (v-model)
│   └── RocketImage.vue         # image with placeholder fallback
├── pages/
│   ├── index.vue               # rocket list screen
│   └── rockets/[id].vue        # rocket detail screen
├── plugins/                    # Vuetify, router, Pinia registration
├── router/                     # router setup (routes generated from pages/)
├── stores/
│   └── rocketStore.ts          # rockets, status, error, add/load actions
├── types/
│   └── rocket.ts               # Rocket and NewRocket types
└── utils/
    └── formatters.ts           # fallback and formatting helpers
```

## Technical Decisions

- **Filtering is client-side.** The list endpoint returns all 13 rockets in one request (`mode=detailed&limit=20`), so filtering the data already in the store avoids extra requests and keeps the app far from the API rate limit.
- **New rockets live in memory.** The API is read-only and the assignment only requires new rockets to appear in the running app, so they are kept in the Pinia store with a `local-` id and disappear on refresh. The detail screen reads them from the store instead of calling the API.
- **The list is fetched once.** The list page only calls the API when the store is `idle`, so coming back from the detail screen does not trigger a new request.
- **The detail screen fetches the single-rocket endpoint** (`/config/launcher/:id/?mode=detailed`) with its own loading, error, and retry states, and cancels the request with `AbortController` when the user leaves the page.
- **API version 2.2.0 and the `lldev` host** are used as specified in the assignment, to avoid the 2.3.0 field changes and the production rate limit.
- **Reusable components.** `ErrorState`, `RocketImage`, and `InfoRow` are shared by both screens, so UI states and fallbacks behave the same everywhere.

## Handling Missing Data

At the time of writing, the API returns `null` for `launch_cost` on 6 rockets, `maiden_flight` on 2 rockets, and `image_url` on 1 rocket (Starship V3). Missing data is handled in one place so both screens stay consistent:

- `utils/formatters.ts`: `formatText`, `formatCost`, and `formatDate` return `N/A` for empty or invalid values. `launch_cost` arrives as a string (e.g. `"7000000"`) and is formatted as USD; dates are formatted in UTC to avoid off-by-one-day errors.
- `RocketImage.vue`: shows a placeholder icon with a fixed aspect ratio when `image_url` is empty or the image fails to load, so the layout does not shift.
- Rockets added by the user may leave every field except the name empty; they go through the same fallbacks.

## Dependency Notes

- `vue-router` is pinned to `4.4.5`. Newer versions break the `vue-router/auto` types provided by `unplugin-vue-router` 0.10.x used by this project.
- `typescript` is `~5.8`, because the installed `@tsconfig/node22` uses the `es2024` lib, which TypeScript 5.6 does not support.

## Possible Improvements

- Unit tests for the formatters and the store, and component tests for the UI states.
- Persist added rockets (e.g. `localStorage`) if the requirement changes.
- Extra filters (country, active/inactive) and sorting.