# SpaceX Rockets

Browse and explore SpaceX rockets with detailed specifications.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Features

- Complete SpaceX rocket catalog
- Real-time search and filtering
- Detailed specifications for each rocket
- Add custom entries
- Responsive layout

## Tech

Vue 3, TypeScript, Vuetify, Pinia, Vue Router, Axios

## Data Source

Launch Library 2 by The Space Devs
- List: `GET /config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
- Detail: `GET /config/launcher/:id/?mode=detailed`

Using development endpoint (`lldev.thespacedevs.com`) for higher rate limits.

## Project Structure

```
src/
├── pages/rockets/       List and detail views
├── stores/             State management
├── services/           API integration
├── types/              TypeScript definitions
└── composables/        Reusable logic
```

## Build

```bash
npm run build        # Production build
npm run preview      # Preview build
npm run type-check   # Type validation
```
