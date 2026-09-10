# Allo Bank Frontend Technical Assignment

## Solution

Vue 3 + TypeScript + Vuetify 3 app showing SpaceX rockets from the Launch
Library 2 API.

### Running

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check + production build
npm run lint       # eslint
```

### Architecture

Server state and client state are deliberately separated:

| Layer | Location | Responsibility |
| ----- | -------- | -------------- |
| API client | `src/services/rocketApi.ts` | Axios instance; maps LL2 responses to the app's `Rocket` type and normalises every failure into a user-readable `RocketApiError`. |
| Server state | `src/queries/rockets.ts` | TanStack Query — fetching, caching, retries, and the loading/error flags the screens render. |
| Client state | `src/stores/rockets.ts` | Pinia — the search filter and rockets added in-app (the API is read-only, so those live in memory and survive a refetch). |
| Routing | `src/pages/` | File-based routes via `unplugin-vue-router`: `index.vue` (list) and `rockets.[id].vue` (detail). |
| Presentation | `src/components/` | Presentational components; the pages own the data wiring. |

### How the requirements are met

- **Rocket list** — `src/pages/index.vue` renders image, name and description per card.
- **Filter** — multi-criteria, combined with AND and all driven from the store: a case-insensitive keyword match on name and description, a country select whose options are derived from the loaded data, a flight-status filter (`maiden_flight` present or not), and a launch-cost availability filter. A result counter and a reset button appear alongside them.
- **Add a rocket** — `AddRocketDialog` writes to the Pinia store, so the new rocket shows up in the list and has a working detail page. Local ids are prefixed `local-` so they can never collide with API ids.
- **Detail screen** — image, name, description, cost per launch, country and first flight.
- **Missing data** — every API-optional field is typed nullable and rendered through `src/utils/format.ts`, which returns `Not available` instead of blanks. A missing or broken `image_url` falls back to a placeholder icon.
- **UI states** — `StateLoading`, `StateError` (with a retry button that refetches) and `StateEmpty` cover loading, failure and no-results.
- **Verified in-browser** — the list, detail, filter combinations, add-rocket flow, retry-after-failure, missing-data fallbacks and the 390px layout were each exercised with Playwright against the running app.
- **Lifecycles** — TanStack Query drives fetching on mount and on retry; the detail query is keyed by route param and disabled for local rockets.
- **Responsive** — 1/2/3/4-column grid across breakpoints; verified with no horizontal overflow at 390px.

### Notes

- Requests go to the `lldev` host, which mirrors production data with a far more generous rate limit.
- `RocketApiError` responses (404, 429) are not retried automatically — the user retries explicitly instead.
- Two pre-existing boilerplate issues were fixed to make `npm run build` pass: TypeScript was raised to 5.9 (`@tsconfig/node22` requests `lib: es2024`, unsupported by 5.6), and `src/router/index.ts` now imports from `vue-router` rather than the deprecated `vue-router/auto`.

---

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
   
4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/nZKQ2EjTCPfAKHog7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.
