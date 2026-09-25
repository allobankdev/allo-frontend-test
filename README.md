# Rocket Explorer

A small web app for browsing SpaceX rockets, built for the
[Allo Bank Frontend Technical Assignment](https://github.com/allobankdev/allo-frontend-test).
Rocket data comes from the [Launch Library 2 API](https://thespacedevs.com/llapi) by The Space Devs.

## Features

- **Rocket list:** image, name and description of every SpaceX rocket.
- **Filtering:** search by name or description and filter by country.
- **Add a rocket:** a form with validation. New rockets appear at the top of the list for the current session, because the API is read-only.
- **Rocket detail:** image, name, description, cost per launch, country and first flight.
- **Missing data:** a placeholder is shown whenever an image, cost, date or description is missing, or when an image fails to load.
- **UI states:** loading skeletons, an error screen with a **Retry** button, and a not-found screen for unknown rockets and routes.
- **Responsive layout:** 1, 2 or 3 columns depending on screen width.

## Tech stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vuetify 3](https://vuetifyjs.com/) for UI components and theming
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) with file-based, typed routes via [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [Vite](https://vitejs.dev/), ESLint and `vue-tsc`

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | Run `vue-tsc` only |
| `npm run lint` | Run ESLint and fix what it can |

### Configuration

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `VITE_LL2_API_BASE_URL` | `https://lldev.thespacedevs.com/2.2.0` | Launch Library 2 base URL |

The default `lldev` host serves the same data as production with a far more
generous rate limit. The production host (`ll.thespacedevs.com`) allows only
15 requests per hour for anonymous users.

## Project structure

```
src/
├── pages/                  File-based routes
│   ├── index.vue           Rocket list: filters, add rocket, loading/error/success states
│   ├── rockets/[id].vue    Rocket detail
│   └── [...path].vue       404 page
├── components/             Presentational components
├── composables/
│   └── useRocketDetail.ts  Resolves a rocket from the store or fetches it from the API
├── stores/
│   └── rockets.ts          Pinia store: API and user-added rockets, filters, request status
├── services/
│   ├── httpClient.ts       fetch wrapper that turns failures into user-friendly errors
│   └── rocketApi.ts        LL2 endpoints and mapping from API fields to the app model
├── types/                  App model (`Rocket`) and LL2 response types
├── utils/format.ts         Currency and date formatting
└── plugins/                Vuetify, Pinia and router setup
```

## API

The app uses Launch Library 2 **v2.2.0**:

```
GET /2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
GET /2.2.0/config/launcher/:id/
```

`mode=detailed` is needed for the description and cost fields, and `limit=20`
returns all 13 SpaceX rockets in one page.

| Shown as | API field |
| -------- | --------- |
| Image | `image_url` |
| Name | `full_name` |
| Description | `description` |
| Cost per launch | `launch_cost` |
| Country | `manufacturer.country_code` |
| First flight | `maiden_flight` |

## Design notes

- **One mapping layer.** API responses are converted once, in `services/rocketApi.ts`,
  into a `Rocket` model where every missing value is `null`. Components never read
  API field names, so an API change only touches that file.
- **Missing data is explicit.** Components show "No image available",
  "Not available" or "No description available." instead of guessing.
- **Fetch once, reuse.** The list is fetched once and kept in the store. The detail
  screen uses the stored rocket when it can and only calls the API when a rocket is
  opened directly by URL. This keeps request counts low under the rate limit.
- **Cancel stale requests.** Pending requests are aborted when leaving a screen
  (`onBeforeUnmount`) or switching rockets, so an old response never overwrites newer state.
- **In-memory additions.** User-added rockets survive navigating between screens but
  not a page reload; opening one's URL after a reload shows a not-found state.
