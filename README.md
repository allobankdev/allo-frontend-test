# Allo Bank Frontend Technical Assignment — Rocket App

A rocket list/detail app built with Vue 3, TypeScript, Vuetify, Pinia, and Vue Router,
using the Launch Library 2 API.

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Create a \`.env\` file (see \`.env.example\`) with:
\`\`\`
VITE_API_BASE_URL=https://lldev.thespacedevs.com/2.2.0
\`\`\`

## Features

- Rocket list with image, name, description
- Filter rockets by name
- Add a rocket locally (API is read-only — added rockets are client-side only and reset on refresh)
- Rocket detail screen (image, name, description, cost per launch, country, first flight)
- Graceful handling of missing fields on both screens
- Loading / error+retry / success states for all API calls

## Tech stack

- Vue 3 + `<script setup>` + TypeScript
- Vuetify (UI components)
- Pinia (state management)
- Vue Router
- Axios

## Project structure

\`\`\`
src/
├── api/ # axios instance + API calls
├── types/ # Rocket types + API→app data mapping
├── stores/ # Pinia store (fetch state, filtering, add-rocket)
├── router/ # route definitions
├── components/ # RocketCard, RocketFilter
└── views/ # RocketListView, RocketDetailView
\`\`\`

## Known limitations

- Locally-added rockets are not persisted (no backend to write to, per the assignment's read-only API constraint)
