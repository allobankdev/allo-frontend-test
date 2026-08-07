# Allo SpaceX Frontend

Vue 3 application listing SpaceX launcher configurations from Launch Library 2.

## Features

- Rocket list with client-side name/description filter
- Runtime rocket creation
- Detail view backed by Pinia state (no single-rocket API request)
- Missing image, name, description, cost, country, and flight-date fallbacks
- Loading, error/retry, empty, and success states
- Vue 3, TypeScript, Vite, Vue Router, Pinia, Vuetify, native `fetch`

Runtime additions live only in memory and reset after page reload. Opening a local rocket detail URL after reload shows the not-found state.

## API

`GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed`

The list and detail views share Pinia state. A detail view does not make a separate single-rocket request.

## Routes

- `/` — rocket list
- `/rockets/:id` — rocket detail

## Setup

```sh
npm install
npm run dev
```

## Quality checks

```sh
npm run lint
npm run type-check
npm run build
```
