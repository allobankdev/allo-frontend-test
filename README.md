# Rocket Atlas

Rocket Atlas is a responsive Vue application for browsing SpaceX launcher
configurations from the Launch Library 2 API. It contains the two screens
requested by the assignment: a filterable rocket catalog and a rocket detail
screen. Rockets added through the UI are kept in application state for the
current browser session because the provided API is read-only.

## Feature Coverage

| Requirement | Implementation |
| --- | --- |
| Rocket list | Image, full name, description, country, and first flight |
| Filtering | Text search plus Falcon, Starship, and Other family filters |
| Add rocket | Validated dialog; the new rocket is inserted into Pinia state |
| Rocket detail | Image, name, description, launch cost, country, and first flight |
| Missing data | Stable text and image fallbacks on both screens |
| Router | File-based routes for `/` and `/rockets/:id` |
| State management | Pinia store for catalog, local entries, detail cache, and UI states |
| Lifecycles | Fetch on mount/route change and abort requests on unmount |
| UI states | Loading skeletons, error with Retry, success, and empty filter result |
| Responsive design | Three/two/one-column catalog and a one-column mobile detail view |

## Tech Stack

- Vue 3 with the Composition API and TypeScript
- Vuetify 3
- Pinia
- Vue Router with `unplugin-vue-router`
- Vite
- Vitest

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- npm

### Install and run

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run preview
```

### Quality checks

```bash
npm run lint
npm run type-check
npm test
```

## API

The application uses the development host requested by the assignment to
avoid the low anonymous rate limit on the production host.

Catalog request:

```text
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
```

Detail request:

```text
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/
```

The API version, `mode=detailed`, and `limit=20` are intentionally kept as
specified. API access is isolated in `src/services/rocketApi.ts`.

## Project Structure

```text
src/
|-- components/       Reusable header, cards, images, dialogs, and UI states
|-- composables/       Screen lifecycle and request cancellation
|-- pages/             Catalog and detail route components
|-- plugins/           Pinia, router, and Vuetify registration
|-- services/          Launch Library 2 HTTP client
|-- stores/            Pinia catalog and detail state
|-- styles/            Global responsive styles
|-- types/             API and form contracts
`-- utils/             Filtering, formatting, and fallback helpers
```

## State and Data Flow

The list and detail screens do not call `fetch` directly. Pages trigger their
composables, composables own the request lifecycle, and the Pinia store owns
data plus `idle`, `loading`, `success`, and `error` states. The store caches
successful remote details by ID and keeps locally added rockets separate from
the API results so a refresh request cannot overwrite them.

Each composable uses an `AbortController` to cancel work when its route is
left. Failed requests preserve a clear error state and can be repeated with
the Retry action. Local rocket IDs use a `local-` prefix, allowing the same
detail route to render them without calling the read-only API.

## Testing

The Vitest suite covers:

- text and family filtering
- formatting and missing-value fallbacks
- browser network error messaging
- list loading success
- failure followed by a successful retry
- local rocket insertion and detail access
- remote detail fetching through the single-rocket service

Run the suite with `npm test`.

## Design Decisions

Local entries intentionally live only in Pinia instead of local storage. This
matches the assignment's running-app requirement and avoids inventing a
persistence contract that the API cannot support. Remote detail data is fetched
from the dedicated endpoint even though the detailed list has overlapping
fields; the extra request demonstrates the required detail lifecycle and keeps
that screen independent of list navigation.
