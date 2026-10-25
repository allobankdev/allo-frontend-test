# SpaceX Rocket Explorer

A responsive web application built for the Allo Bank Frontend Technical Assignment. The application displays SpaceX rockets using Launch Library 2 API and provides search, local rocket creation, and rocket detail views.

## Features

- **Rocket listing:** Displays SpaceX rockets with their images, names, and descriptions.
- **Debounced search:** Filters rockets by name after 300 ms of inactivity.
- **Add rocket:** Adds a custom rocket to the current application session without writing to the read-only API.
- **Rocket details:** Displays the rocket image, name, description, launch cost, country, and first-flight date.
- **Client-side routing:** Supports navigation between the list and detail pages, including direct detail URLs.
- **Error handling:** Provides loading, retry, missing-data, and not-found states.
- **Responsive layout:** Uses a responsive grid for mobile, tablet, and desktop screens.
- **Missing-data fallbacks:** Handles unavailable images and optional rocket information without breaking the UI.

## Technology Stack

- Vue 3
- TypeScript
- Vuetify 3
- Vue Router
- Vite
- Launch Library 2 API

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/firdausbasyuni/allobank-frontend.git
cd allobank-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite. The application uses port `3000` in the current Vite configuration.

## API

The application uses Launch Library 2 API version `2.2.0`.

### Rocket list

```http
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
```

The `mode=detailed` parameter provides the detail fields required by the assignment. The `limit=20` parameter allows all 13 SpaceX rockets to be returned in one request.

### Rocket detail

```http
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/
```

The API is read-only for this application. Custom rockets are stored in client-side reactive state and are not persisted to the API or across a full page refresh.

## Project Structure

```text
src/
├── components/
│   ├── AddRocketDialog.vue
│   └── RocketCard.vue
├── composables/
│   └── useRockets.ts
├── pages/
│   ├── index.vue
│   ├── [...path].vue
│   └── rockets/
│       └── [id].vue
├── services/
│   └── rocketService.ts
├── types/
│   └── rocket.ts
├── plugins/
├── router/
├── styles/
├── App.vue
└── main.ts
```

## Validation

Run the TypeScript check:

```bash
npm run type-check
```

Create a production build:

```bash
npm run build
```

Both commands should complete successfully before submission.
