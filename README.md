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
   
4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/YAbAQxPuJAdDYmRW7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.

---

## Solution

### Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check + production build
npm run lint
```

### Stack

Vue 3 + TypeScript, Vuetify 3, `vue-router` (file-based routes via `unplugin-vue-router`), Pinia for state management.

### Structure

```
src/
  pages/
    index.vue            # rocket list: filter, add rocket, loading/error/success
    rockets/[id].vue     # rocket detail -> route /rockets/:id
  components/
    StateView.vue        # Loading / Error + Retry / Success (slot) in one place
    RocketCard.vue       # list item (image, name, description)
    RocketImage.vue      # image with placeholder for missing or broken URLs
    RocketFilter.vue     # filter input (v-model)
    AddRocketDialog.vue  # validated form for a new (local) rocket
  stores/rocketStore.ts  # Pinia: list + detail state, filter, addRocket
  services/rocketApi.ts  # fetch + DTO -> Rocket mapping, typed ApiError
  types/rocket.ts        # Rocket (app model) and API DTOs
  utils/format.ts        # cost/date/text formatting with fallbacks
```

### Decisions

- **UI states**: both screens go through `StateView` (`idle/loading` shows a spinner, `error` shows a message and a **Retry** button, `success` renders the content).
- **Missing data**: the API response is normalised once in `mapRocket`. Absent `image_url`, `launch_cost`, `maiden_flight`, `description` or country become `null`, and the UI shows a placeholder image, "Unknown" or "No description available.". `launch_cost` arrives as a string and is converted to a number.
- **Filter**: case-insensitive match on name and description (`filteredRockets` getter in the store), with a message when nothing matches.
- **Add rocket**: kept only in the store because the API is read-only. It is shown first with a "New" chip, survives list reloads, and its detail page needs no API call. It is lost on a full page refresh by design.
- **Detail**: opening a rocket from the list reuses the already loaded (`mode=detailed`) data. A direct visit or refresh on `/rockets/:id` calls the single-rocket endpoint.
- **Lifecycles**: the list is fetched in `onMounted` (skipped when data is already loaded), the detail page reacts to route param changes with `watch`, and in-flight requests are cancelled with `AbortController` in `onBeforeUnmount`.
- **API**: uses the `lldev.thespacedevs.com` host and version `2.2.0`, as specified.

### Notes on dependencies

The starter has no lockfile, and its floating version ranges broke `npm run type-check` on a fresh install. Two packages are therefore pinned: `@tsconfig/node22@22.0.0` (newer versions need a newer TypeScript) and `vue-router@4.5.1` (4.6 conflicts with the typings of `unplugin-vue-router` 0.10). `typed-router.d.ts` and `components.d.ts` are generated by the Vite plugins, committed, and included in `tsconfig.app.json`.
