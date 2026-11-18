# Allo Rockets — Frontend

A web app that lists rockets and shows their details, built with **Vue 3 + Vite + TypeScript + Vuetify**. Data comes from [Launch Library 2](https://thespacedevs.com/llapi) (API 2.2.0).

## Features

- **Rocket list** with image, name, and description
- **Filter** by name, description, or country (no extra request)
- **Add rocket** through a form. Added rockets only exist in memory and are lost when the page is reloaded
- **Rocket detail** with image, name, description, cost per launch, country, and first flight
- **Missing data** is shown as "Not available" or an image placeholder, without breaking the page
- **UI states**: loading, error with a *Try again* button, and success
- **Responsive** layout with the Vuetify grid (1, 2, 3, or 4 columns)

## Running

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Optional configuration is in `.env.example`. By default the app uses the `lldev.thespacedevs.com` host, which has a much higher rate limit than `ll.thespacedevs.com` (15 requests per hour for anonymous users).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check, then production build |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint with auto-fix |

## Structure

```
src/
├── api/launchLibrary.ts     # HTTP client for Launch Library 2 (pagination, errors)
├── components/
│   ├── AppStateView.vue     # Loading / error + retry / slot for success
│   ├── RocketCard.vue       # Rocket card in the list
│   ├── RocketFormDialog.vue # Add-rocket form with validation
│   └── RocketImage.vue      # Image with fallback when empty or failed to load
├── pages/
│   ├── index.vue            # Rocket list + filter + add
│   └── rockets/[id].vue     # Rocket detail
├── stores/rockets.ts        # State (Pinia): list, detail, filter, local rockets
├── types/
│   ├── rocket.ts            # UI types
│   └── mappers.ts           # API → UI mapping (missing values become null)
└── utils/format.ts          # Cost (USD) and date formatting
```

Routing uses file-based routing from `unplugin-vue-router`: `pages/index.vue` becomes `/`, and `pages/rockets/[id].vue` becomes `/rockets/:id`.

## Design decisions

- **Store (Pinia)** keeps the load status for the list and the detail. The list is fetched once unless the user presses *Try again*. The detail uses data already in the list, and only calls the API when the rocket is not cached (for example when opening a link directly).
- **Race condition**: a late detail response for a rocket the user has already left is ignored.
- **Lifecycle**: the list loads in `onMounted`, and the detail reloads when the route parameter changes (`watch`).
- **API mapping** lives outside the components, so every missing value becomes `null` in one place.

## Tests

```bash
npm test
```

20 unit tests cover mapping incomplete data, cost and date formatting, and the store: retry after an error, filtering, caching, 404, and late responses.
