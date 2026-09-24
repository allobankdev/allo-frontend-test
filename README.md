# Allo Bank Frontend Technical Assignment

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

---

## Implementation

A Vue 3 + TypeScript app showing SpaceX rockets from Launch Library 2 (v2.2.0, `lldev` host), built on the provided Vuetify starter.

### Getting started

Requires Node.js 22.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build
npm run type-check
npm run lint         # note: runs eslint --fix
```

### Tech choices

- **Vue 3** (`<script setup>`, Composition API) and **TypeScript**
- **Vuetify 3** for UI and the responsive grid; no other UI library
- **Vue Router** with file-based routes from `unplugin-vue-router` (`src/pages`)
- **Pinia** for state management (the only added dependency)
- Native **`fetch`** for HTTP

### Routes

| Route          | Page                        | Screen        |
| -------------- | --------------------------- | ------------- |
| `/`            | `src/pages/index.vue`       | Rocket list   |
| `/rockets/:id` | `src/pages/rockets/[id].vue` | Rocket detail |

### Architecture

```
src/
  types/rocket.ts           API response types (only the fields used) + normalized Rocket model
  types/request.ts          RequestStatus (idle / loading / success / error)
  services/rocketService.ts API calls, response validation, API → Rocket mapping, error messages
  stores/rockets.ts         Pinia store: API rockets, local rockets, list status, lookup
  utils/parsers.ts          Clean raw API/form values (trim, number, date, URL) into value-or-null
  utils/formatters.ts       Display fallbacks ("N/A", "Description unavailable") and USD/date formatting
  utils/errors.ts           AppError (user-facing message + whether retry can help)
  components/               RocketCard, RocketImage, RocketDetail, RocketFilter, AddRocketDialog,
                            LoadingState, ErrorState, EmptyState (auto-imported)
  pages/                    Route components
```

The service maps API data to a single `Rocket` shape, and locally added rockets use that same shape. Components never touch raw API fields or nullable nested objects.

### State management

The `rockets` store holds shared state: API rockets, locally added rockets, list request status and error, and these actions:

- `fetchRockets()`: loads the list once per session. It skips the request when data is already loaded, and calling it again after a failure is the retry.
- `fetchRocketDetail(id)`: returns the rocket from state when present (the list is fetched with `mode=detailed`, so it already has every detail field). Otherwise it requests `GET /config/launcher/:id/`, for example after a refresh on a detail URL.
- `addRocket(input)`: adds a local rocket.

Screen-specific state stays in components: the search text, dialog visibility, and the detail page's own loading/error state.

### Adding rockets

The API is read-only, so **Add rocket** only updates the store, and nothing is sent to the API. Local rockets appear at the top of the list with an "Added locally" chip. Their ids use a `local-` prefix, which can't collide with the API's numeric ids, and their detail pages work during the session. Local rockets are kept in memory only, so **a browser refresh removes them**. Opening a local rocket's URL after a refresh shows a "no longer available" message instead of an error or a crash.

Only the name is required. Cost must be a non-negative number, the image URL must be `http(s)`, and the first flight must be a valid date when given.

### Missing data

The API has nulls for `image_url`, `launch_cost` and `maiden_flight`, and `manufacturer` or `description` may also be missing. Values are normalized to `null` in one place (the service) and displayed through shared formatters:

| Field           | Fallback                                                          |
| --------------- | ----------------------------------------------------------------- |
| Image           | "No image available" placeholder; a broken URL shows "Image unavailable" |
| Description     | "Description unavailable"                                         |
| Cost per launch | "N/A" (otherwise USD, e.g. `$52,000,000`)                         |
| Country         | "N/A" (otherwise `manufacturer.country_code`)                     |
| First flight    | "N/A" (otherwise e.g. `May 11, 2018`; invalid dates never render) |

### UI states

Both screens have loading, error with **Retry** (which re-runs the failed request), and success states. The list also has empty states for "no rockets" and "no search matches". Retry is hidden where it can't help: a 404, or a local rocket that no longer exists.
