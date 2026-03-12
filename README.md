# SpaceX Rockets

A Vue 3 web application that displays SpaceX rocket data using the [SpaceX API](https://github.com/r-spacex/SpaceX-API).

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — Type-safe development
- **Vuetify 3** — Material Design component library (dark theme)
- **Pinia** — State management
- **Axios** — HTTP client for API calls
- **Vite** — Fast build tooling
- **Vue Router** — File-based routing via `unplugin-vue-router`

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## Features

- **Rocket List** — Browse all SpaceX rockets with images, names, and descriptions
- **Search/Filter** — Filter rockets by name or description in real-time
- **Add Rocket** — Add custom rockets locally via a form dialog
- **Rocket Detail** — View full rocket details including cost, country, first flight, dimensions, and more
- **UI States** — Loading spinners, error messages with retry buttons, and empty states
- **Responsive Design** — Adapts from mobile (1 column) to desktop (4 columns) using Vuetify grid breakpoints

## Project Structure

```
src/
├── components/       # Reusable Vue components (auto-imported)
│   ├── RocketCard.vue
│   └── AddRocketDialog.vue
├── pages/            # File-based routing
│   ├── index.vue     # Redirects to /rockets
│   └── rockets/
│       ├── index.vue # Rocket list page
│       └── [id].vue  # Rocket detail page
├── stores/           # Pinia state management
│   └── rocket.ts
├── services/         # API layer
│   └── api.ts
├── types/            # TypeScript interfaces
│   └── rocket.ts
└── plugins/          # Vue plugin registration
    ├── index.ts
    └── vuetify.ts
```

## API

Uses the SpaceX v4 API:
- `GET /rockets` — List all rockets
- `GET /rockets/:id` — Get rocket by ID
