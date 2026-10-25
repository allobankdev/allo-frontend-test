# Solution Notes

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vuetify
- Vue Router
- Pinia

## Implementation

The application includes:

- Rocket list using Launch Library 2 API
- Local rocket filtering/search
- Runtime-only rocket creation
- Rocket detail page
- Loading state
- Error state with retry
- Missing-data fallbacks
- Responsive layout

## Architecture

- `src/pages` for route-based pages
- `src/components` for reusable UI components
- `src/services` for API communication
- `src/stores` for Pinia state management
- `src/types` for TypeScript types

## Local Rocket Behavior

Newly added rockets are stored only in Pinia runtime state.

They are intentionally not persisted after page refresh because the provided API is read-only and the assignment only requires newly added rockets to appear in the running application.

## API

Launch Library 2 API version `2.2.0` is used as required by the assignment.

## Run Locally

```bash
npm install
npm run dev