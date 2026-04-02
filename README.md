# SpaceX Rockets

Vue 3 application for the Allo Bank frontend assignment. The app shows a list of SpaceX rockets, supports filtering, allows adding a new rocket locally, and provides a dedicated detail screen for each rocket.

## Features

- Rocket list screen with image, name, and description
- Rocket detail screen with image, name, description, cost per launch, country, and first flight
- Client-side filtering by name, description, or country
- Add rocket dialog with form validation
- Loading, error, retry, success, and empty states
- Responsive layout built with Vuetify
- State management with Pinia
- File-based routing with Vue Router

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vuetify 3
- Pinia
- Axios
- SpaceX API v4

## Project Structure

```text
src/
  components/
    AddRocketDialog.vue
    RocketCard.vue
  pages/
    index.vue
    rockets/[id].vue
  plugins/
    index.ts
    vuetify.ts
  router/
    index.ts
  services/
    api.ts
  stores/
    rocketStore.ts
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Run checks

```bash
npm run type-check
npm run lint
npm run build
```

## Notes

- Rocket data is fetched from the SpaceX API.
- Newly added rockets are stored locally in Pinia and remain fully navigable to the detail page.
- The app uses file-based routes, so `src/pages/index.vue` maps to `/` and `src/pages/rockets/[id].vue` maps to `/rockets/:id`.
