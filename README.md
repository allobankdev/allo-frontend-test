# Launch Atlas — frontend implementation

This solution extends the Allo Bank Vue starter with a SpaceX rocket catalog and a detail page. It uses Vue 3, TypeScript, Vuetify, Vite and Vue Router. The original assignment is retained below.

## Run locally

Use Node.js 22 LTS or newer and npm. Extract the project and open the folder containing `package.json` in VS Code. In its terminal, run each command in sequence.

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal, normally `http://127.0.0.1:3000`. Keep that terminal running. Press Ctrl+C to stop the development server. On subsequent visits, run `npm run dev` again. An internet connection is needed to obtain the initial API data and rocket images.

## Production build and code checks

```sh
npm run build
npm run lint
npm run preview
```

Build performs TypeScript checking and creates `dist/`. Preview serves that build at the address printed in the terminal, normally port 4173. The lockfile fixes the dependency versions. TypeScript was updated to 5.9.3 for compatibility with the starter's Node 22 TypeScript configuration.

## Features

- The list page displays the rocket image, name and description from Launch Library 2.
- Search matches rocket names without case sensitivity. A family filter works together with search.
- Clicking a card opens `/rockets/:id`, with name, description, image, launch cost, country and first-flight date.
- Add rocket opens a labeled, keyboard-accessible dialog. A name is required. Image URL, description, cost, country code and first flight are optional.
- New rockets receive a unique local ID and immediately appear in the catalog. Filters reset after an addition so the new item is visible.
- A new rocket's detail page reads the same session state. Local additions are cleared by a page refresh.
- Both screens display loading, failure with a working retry button, and successful results. The list also handles no results and an empty API response.
- Missing text, null values and broken images use readable fallbacks. Zero launch cost is displayed as zero.
- The responsive layout supports desktop and mobile screens. The dialog supports keyboard focus and Escape to close.

## API and data mapping

Requests use the development host and version specified by the assignment.

```text
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/?mode=detailed
```

| API field | UI value |
| --- | --- |
| image_url | Rocket photo |
| full_name | Rocket name |
| description | Description |
| launch_cost | Cost per launch in USD |
| manufacturer.country_code | Country code |
| maiden_flight | First flight |

The catalog loads once per running app and keeps its data in memory. Detail navigation reuses loaded detailed data. Opening a remote detail URL directly fetches that rocket. Requests time out after 20 seconds and allow retry. Loading a local ID after a refresh displays an explanation and a link back to the catalog.

## Code structure

| File | Responsibility |
| --- | --- |
| src/services/rockets.ts | Fetch, timeout handling and normalization of API responses |
| src/stores/rockets.ts | Shared reactive state, list caching, filters, local additions and detail cache |
| src/router/index.ts | List and detail routes |
| src/pages/index.vue | Catalog, search and family filter |
| src/pages/RocketDetail.vue | Detail loading and display |
| src/components/AddRocketDialog.vue | Form and input validation |
| src/components/RocketCard.vue | Reusable list card |
| src/components/RocketImage.vue | Image and missing/broken-image fallback |
| src/components/RequestState.vue | Loading and error/retry states |
| src/utils/format.ts | Cost and date display |

State management uses Vue's `reactive`, `readonly` and `computed` APIs in a shared store. The list starts fetching in `onMounted`. The detail page watches the route ID immediately and guards against responses arriving out of order. A history-mode deployment must route unknown application paths to `index.html`.

## Verification

The implementation was checked with a production build, TypeScript and ESLint. Browser checks covered the live API list and direct detail URL, combined filters and back navigation, local creation and detail navigation, zero and nonzero costs, blank-name rejection, mobile layout, missing fields and image fallbacks. Simulated API failures verified retry on both pages. Simulated delayed and empty responses verified loading and empty-state rendering.

## Submit using the original repository

1. Fork `allobankdev/allo-frontend-test` into your own GitHub account.
2. Clone your fork and create the branch `feat/allo-spacex`.
3. Copy this solution's files into the cloned project. Put `package.json` and `src/` at the repository root.
4. Run `npm ci`, `npm run build` and `npm run lint`.
5. Commit and push the feature branch to your fork.
6. Open a Pull Request from that branch to `allobankdev/allo-frontend-test`.
7. Fill in the submission form linked in the assignment and send the frontend link to HR.


---

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
