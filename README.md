# SpaceX Launch Vehicle Registry

A two-screen web app for browsing SpaceX launch vehicles, built for the **Allo Bank Frontend Technical Assignment**.
It lists every SpaceX rocket from the [Launch Library 2 API](https://thespacedevs.com/llapi), lets you search, filter and
add your own rockets, and shows a full datasheet for each vehicle.

The original assignment brief is kept at the [end of this file](#original-assignment-brief).

---

## Features

**Rocket list (`/`)**
- Shows every SpaceX rocket with its image, name and description.
- Search by name **or** description (case-insensitive).
- Filter by country and by source (`All` / `API` / `Local`). Search and filters can be combined and reset with one click.
- Result counter (`Showing X of Y vehicles`) and a summary of total, active and retired vehicles.
- **Add rocket** dialog with client-side validation. New rockets appear at the top of the list.

**Rocket detail (`/rockets/:id`)**
- Image, full name, description, **cost per launch, country and first flight**.
- Extra datasheet sections when the data exists: specifications (height, diameter, mass, payload, thrust, stages,
  apogee), flight record (launch and landing success rates) and manufacturer profile with external links.
- Works for API rockets and locally added rockets, and can be opened directly by URL.

**UI states and resilience**
- Loading, error with **Retry**, empty and not-found states on both screens.
- Missing API values (`image_url`, `launch_cost`, `maiden_flight`, etc.) fall back to a placeholder or "Not available";
  empty datasheet rows are hidden. Broken image URLs also fall back to a placeholder.
- Responsive layout (1, 2 or 3 column grid) for mobile, tablet and desktop.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Language | TypeScript 5.6 (strict) |
| Build tool | Vite 5 |
| Routing | Vue Router 4 with file-based routes via `unplugin-vue-router` |
| State management | Pinia |
| Styling | Tailwind CSS 3.4 (main styling), Sass (Vuetify settings) |
| UI framework | Vuetify 3 (kept from the starter for the app shell: `v-app` / `v-main`) |
| HTTP | Native Fetch API with `AbortController` |
| Linting | ESLint 9 (flat config) with `eslint-plugin-vue` and `@vue/eslint-config-typescript` |
| Icons & fonts | Material Design Icons (`@mdi/font`); Barlow Condensed, IBM Plex Sans and IBM Plex Mono from Google Fonts |

## Getting started

### Prerequisites

- **Node.js 20.19 or newer** (required by `sass-embedded`; developed with Node 26 and npm 12)
- npm
- Internet access (the app calls the Launch Library 2 API and loads fonts from Google Fonts)

### Install

```bash
npm install
```

### Environment variables

The API base URL is read from `.env`:

```env
VITE_API_BASE_URL=https://lldev.thespacedevs.com/2.2.0
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `https://lldev.thespacedevs.com/2.2.0` | Launch Library 2 base URL. If it is unset, the default is used. |

To override it locally without touching `.env`, create `.env.local` (git-ignored).
`VITE_*` variables are bundled into the client, so never put secrets in them (none are needed here).

### Run

```bash
npm run dev          # development server at http://localhost:3000
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build locally
```

### Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the Vite dev server on port 3000 |
| `build` | Run `type-check` and `build-only` in parallel |
| `build-only` | Production build with Vite |
| `preview` | Preview the production build |
| `type-check` | Type-check with `vue-tsc --build --force` |
| `lint` | Run ESLint **with `--fix`** (modifies files). Use `npx eslint .` to only report. |

## Project structure

```
src/
├── main.ts                  # Creates the app and registers plugins
├── App.vue                  # App shell: background, header, page outlet, footer
├── pages/                   # File-based routes
│   ├── index.vue            #   /            Rocket list
│   └── rockets/[id].vue     #   /rockets/:id Rocket detail
├── components/              # Auto-imported UI components
│   ├── RocketCard, RocketFilter, RocketImage, AddRocketDialog, FormField
│   ├── RocketSpecs, RocketLaunchRecord, RocketManufacturer, ExternalLinks
│   ├── DetailSection, DataRow, StatTile
│   ├── LoadingState, ErrorState, EmptyState
│   └── AppHeader, SpaceBackdrop
├── composables/
│   └── useRocketForm.ts     # Add-rocket form state, validation and mapping
├── stores/
│   └── rockets.ts           # Pinia store (data, cache, request status, filters)
├── services/
│   ├── apiClient.ts         # fetch wrapper, base URL, HTTP error handling
│   └── rocketService.ts     # LL2 endpoints + mapping API data → Rocket model
├── types/
│   └── rocket.ts            # API response types and the normalized Rocket model
├── utils/                   # format.ts (currency/date/number), error.ts, id.ts
├── router/index.ts          # Router setup (auto routes, scroll behavior)
├── plugins/                 # Vuetify, Pinia and router registration
├── styles/                  # tailwind.css, settings.scss (Vuetify Sass settings)
└── assets/planets/          # Background artwork (PNG)
```

## Launch Library 2 integration

The app uses **Launch Library 2 API v2.2.0** on the `lldev.thespacedevs.com` host. That host serves the same data as
production with a much higher rate limit (production allows 15 requests/hour for anonymous users).

### Endpoints

| Purpose | Request |
| --- | --- |
| Rocket list | `GET /config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20` |
| Single rocket | `GET /config/launcher/:id/` |

- `mode=detailed` is required, because without it the response omits `description` and the other detail fields.
- `limit=20` returns all 13 SpaceX rockets in one page (the default page size is 10).
- The API is read-only. The app only sends `GET` requests.

### Field mapping

API responses are mapped once, in `rocketService.ts`, to a normalized `Rocket` model. Missing or empty values become
`null`, so the UI handles a single "missing" case.

| Requirement | API field | `Rocket` field |
| --- | --- | --- |
| Rocket image | `image_url` | `imageUrl` |
| Rocket name | `full_name` (falls back to `name`) | `name` |
| Description | `description` | `description` |
| Cost per launch | `launch_cost` (numeric string) | `launchCost` (number) |
| Country | `manufacturer.country_code` | `country` |
| First flight | `maiden_flight` | `firstFlight` |

Additional detail fields (`family`, `variant`, `active`, `reusable`, dimensions and payload, launch and landing counts,
`manufacturer`, `program`, `wiki_url`, `info_url`) are mapped the same way and shown only when present.

### Request handling

- **Caching:** the list is fetched once and reused. A second `fetchRockets()` call, or one made while a request is in
  flight, does not hit the API. Retry forces a refetch.
- **Detail lookups** check local rockets, then the cached list, then a per-id cache. Only an unknown API id triggers
  `GET /config/launcher/:id/`. Locally added rockets never trigger a request.
- **Cancellation:** the detail request uses an `AbortController` and is aborted when you leave the detail page or open
  another rocket.
- **Errors:** HTTP and network failures become an `ApiError` with a user-friendly message (404, 429 rate limit, 5xx,
  network, invalid JSON). A 404 shows the not-found state; other errors show the error state with Retry.

## State management

All rocket state lives in one Pinia setup store, `src/stores/rockets.ts`:

| Kind | Members |
| --- | --- |
| State | `apiRockets`, `localRockets`, detail cache, `listStatus` / `listError`, `detailStatus` / `detailError` / `detailNotFound`, `filters` (`query`, `country`, `source`) |
| Getters | `rockets` (local first, then API), `filteredRockets`, `countries`, `hasActiveFilters`, `getRocket(id)` |
| Actions | `fetchRockets({ force })`, `fetchRocketById(id)`, `cancelDetailRequest()`, `addRocket(input)`, `setFilters(patch)`, `resetFilters()` |

Components read from the store with `storeToRefs`. Filtering logic exists only in the `filteredRockets` getter.

## Routing

Routes are generated from `src/pages` by `unplugin-vue-router`, with typed route names and params.

| Path | Page | Notes |
| --- | --- | --- |
| `/` | `pages/index.vue` | Fetches the list in `onMounted` (cached after the first load) |
| `/rockets/:id` | `pages/rockets/[id].vue` | Reads `id` from route params, loads via `fetchRocketById`, cancels the request in `onBeforeUnmount` |

New pages open at the top. Browser back and forward restore the previous scroll position. The starter's
dynamic-import reload workaround in `router/index.ts` is kept.

## Limitations

- **Locally added rockets are kept in memory only.** The API is read-only, so new rockets exist only in the running
  app (as the assignment specifies). They disappear on page refresh, and their detail URLs then show the not-found state.
- Local rockets have no flight record. That data comes from real launch history, so the form doesn't ask for it.
- Requires network access to the Launch Library 2 API and Google Fonts. There is no offline mode.
- The list is limited to SpaceX rockets (`manufacturer__name=SpaceX`).
- No automated test suite is included in the repository.
- The Add Rocket dialog does not trap keyboard focus.

---

## Original assignment brief

<details>
<summary>Allo Bank Frontend Technical Assignment (original README)</summary>

In this assignment, you’re assigned to create a website that displays rockets. This website only has two screens: rocket list screen and rocket detail screen. Here are the requirements:

### Functional Requirements
- As a user, I want to see a list of rockets in the rocket list screen (Show each rocket image, rocket name, and rocket description)
- As a user, I want to be able to filter the rockets in the rocket list screen
- As a user, I want to be able to add the new rocket in the rocket list screen (the API is read-only, so the new rocket only needs to appear in the running app)
- As a user, I want to be able to see the rocket detail by clicking a rocket in the rocket list screen (Show rocket image, rocket name, rocket description, cost per launch, country, first flight)
- As a user, I want both screens to still display correctly when some rocket data is missing

### API

Use the Launch Library 2 API by The Space Devs for rocket data.
Docs: https://thespacedevs.com/llapi

Rocket list (returns all 13 SpaceX rockets in a single request):

    GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20

Single rocket:

    GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/

`mode=detailed` is required — without it the response omits `description`
and the other detail fields. `limit=20` is required too — the default page size
is 10, so without it you get 10 rockets and a `next` page instead of all 13.

**API version:** use `2.2.0` as shown above. The docs site now showcases
`2.3.0`, but `2.2.0` is still live with no announced end-of-life, and the field
names in the table below are the `2.2.0` ones. Don't migrate: `2.3.0` renames
the endpoint to `/2.3.0/launcher_configurations/` and moves several of these
fields (`image_url` becomes `image.image_url`, `manufacturer.country_code`
becomes a `manufacturer.country` array). Both versions return the same 13
rockets.

| Requirement      | Field                              |
| ---------------- | ---------------------------------- |
| rocket image     | `image_url`                        |
| rocket name      | `full_name`                        |
| description      | `description`                      |
| cost per launch  | `launch_cost`                      |
| country          | `manufacturer.country_code`        |
| first flight     | `maiden_flight`                    |

**Rate limit:** the API allows 15 requests/hour for anonymous users. Use the
`lldev.thespacedevs.com` host shown above during development — it serves the
same data with a far more generous limit. The production host,
`ll.thespacedevs.com`, will throttle you quickly.

Note that some rockets have missing values for `launch_cost`, `maiden_flight`,
and `image_url`.

### Non-Functional Requirements
- Use the Launch Library 2 API (see the API section above) for getting the rocket data
- Implement routers
- Implement state management
- Implement lifecycles
- Create components based will be + points
- UI states (Loading, Fail/Retry, and Success)
- Show loading when waiting response from API
- If an error occurred, user can retry by pressing retry button
- Show result when get response from API

### Nice to have characteristics
Responsive design
You don’t need to worry about the detailed design, we’re not interested in your artistic prowess (for now), put your efforts on creating a readable/clean/maintainable source code.

### Submission

1.  **Fork** this repository.

2.  Implement your solution on a dedicated feature branch (e.g., `feat/allo-spacex`).

3.  When complete, submit your solution via a **Pull Request (PR)** back to the main repository.

4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/YAbAQxPuJAdDYmRW7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.

</details>
