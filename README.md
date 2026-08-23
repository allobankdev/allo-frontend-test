# SpaceX Rocket Explorer - Frontend

A Vue 3 and TypeScript application that displays SpaceX rocket configurations using the Launch Library 2 API.

---

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vuetify 3
- Vite
- Vue Router

---

## Features

- **Rocket List Screen (`/`):** Displays SpaceX rockets with image, name, and description.
- **Filter and Search:** Filter rockets by name, description, country, and sort by name, first flight date, or launch cost.
- **Add New Rocket:** Client-side modal to add custom rockets to the active session.
- **Rocket Detail Screen (`/rockets/:id`):** Displays rocket image, full name, description, cost per launch, manufacturer country, and maiden flight date.
- **Graceful Data Handling:** Fallbacks for missing values (`launch_cost`, `maiden_flight`, `image_url`, `description`).
- **UI States:** Explicit handling for Loading (skeleton loaders), Fail/Retry (error alert with retry action), and Success states.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The application will run at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```
