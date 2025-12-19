# Allo Frontend Test – SpaceX Rockets

## Overview

This project is a **Vue 3 frontend application** built as part of the **Allo Bank Frontend Technical Assignment**.  
The application consumes the public **SpaceX API** to display a list of rockets, provide detail views, and allow users to add rockets locally.

---

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router (file-based routing)
- Vuetify
- Axios

---

## Features

- Rocket list fetched from SpaceX public API
- Rocket detail page using dynamic routing
- Client-side search/filter by rocket name
- Add new rockets locally (no backend mutation)
- Loading and error handling states
- Minimal, framework-native UI using Vuetify

---

## How to Run

### Install Dependencies
```bash
npm install
```

### Run the application
```bash
npm run dev
```

Application will start at: http://localhost:3000
---
## Routing Endpoint
| File Path                   | Route         | Description        |
| --------------------------- | ------------- | ------------------ |
| `src/pages/index.vue`       | `/`           | Rocket list page   |
| `src/pages/rocket/[id].vue` | `/rocket/:id` | Rocket detail page |

---
## Personalization
Github: noobsemaj / kzulfazriawan
Email: kzulfazriawan@gmail.com