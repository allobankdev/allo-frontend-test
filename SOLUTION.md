# Solution Notes

## Overview

This project implements the Allo Bank Frontend Technical Assignment using Vue 3, TypeScript, Vuetify, Vue Router, and Pinia.

The application displays SpaceX rockets from Launch Library 2, supports filtering, allows users to add temporary rockets locally, and provides a detail page for each rocket.

## Features

- Rocket list page with image, name, and description
- Rocket detail page with image, name, description, launch cost, country, and first flight date
- Search by rocket name and description
- Filter by country
- Sort by name or launch cost
- Runtime-only rocket creation
- Loading, error, retry, success, and empty states
- Fallback content for missing data
- Responsive layout
- Unit and component tests

## Tech Stack

- Vue 3
- TypeScript
- Vuetify
- Vue Router
- Pinia
- Vitest
- Vue Test Utils
- Launch Library 2 API

## API

The app uses Launch Library 2 development API:

```txt
https://lldev.thespacedevs.com/2.2.0


Run Locally:

--Install dependencies:
npm install

--Run development server:
npm run dev

--Run validation:
npm run type-check
npm run build
npm test
