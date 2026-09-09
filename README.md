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

## Solution

Vue 3 (`<script setup>` + TypeScript), Vuetify 3, Vite. File-based routing via
`unplugin-vue-router`.

### Running

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # type-check + production build
    npm run lint

Requires Node 18+. No env vars — the API base URL is hardcoded to the dev host
`lldev.thespacedevs.com` (generous rate limit, per the API note above).

### Structure

    src/services/spaceDevs.ts     # the only place that touches fetch + the Rocket type
    src/composable/useRockets.ts  # store: rocket state, fetch, add, lookup by id
    src/pages/index.vue           # list + filter + add-rocket dialog
    src/pages/rockets/[id].vue    # detail
    src/components/               # RocketCard, RocketFormDialog

### Decisions

- **State management** is a composable with module-scope `ref`s
  (`useRockets`), so the state is a singleton shared by the list and detail
  pages. Pinia was deliberately skipped: there is a single collection of data,
  so Vue's own reactivity covers it with zero extra dependencies.
- **One request only.** The API returns all 13 rockets at once, so the detail
  page reads from that same state (`getRocketById`) instead of hitting the
  `/:id` endpoint. `fetchRockets()` runs `onMounted` on both pages and skips
  when data is already loaded, so deep-linking to `/rockets/:id` works without
  a duplicate request — which matters given the 15 requests/hour anonymous
  limit.
- **UI states**: loading (skeleton/spinner), error with a Retry button
  (`fetchRockets(true)`), and success are handled on both screens.
- **Missing data** (`launch_cost`, `maiden_flight`, `image_url` returning null)
  falls back to `N/A` / a placeholder image, so the layout never breaks.
- **New rockets** are kept in memory with a `local-*` id and an `isLocal` flag,
  per the brief (the API is read-only). They are lost on refresh — not
  persisted to localStorage since that wasn't asked for.

### Known limitations

- Filtering is name-only and client-side.
- No unit tests.