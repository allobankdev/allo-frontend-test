# Allo Bank Frontend Technical Test

A Vue 3 application that displays SpaceX rocket data with list and detail views, demonstrating modern frontend development practices.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **UI Library**: Vuetify 3
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Type System**: TypeScript
- **API**: SpaceX API (https://github.com/r-spacex/SpaceX-API)

## Features

### Core Functionality
- Rocket list view with image, name, and description
- Rocket detail view with comprehensive information (image, name, description, cost per launch, country, first flight)
- Filtering capabilities for rocket list
- Add new rocket functionality
- Responsive design

### Technical Implementation
- Component-based architecture
- State management with Pinia stores
- Route management with Vue Router
- TypeScript for type safety
- UI state handling (Loading, Error/Retry, Success)
- Error handling with retry mechanism
- Loading states during API calls

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
├── pages/           # Page components
├── plugins/         # Vue plugins
├── router/          # Routing configuration
├── stores/          # Pinia stores
├── styles/          # Global styles
├── types/           # TypeScript types
└── App.vue          # Root component
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- pnpm (recommended) or npm/yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/irfanfitriandi/allo-frontend-test.git

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Available Scripts
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint
- `pnpm type-check`: Run TypeScript type checking

## Development Notes

### Key Implementation Decisions
- **Component Organization**: Separated presentational and container components for better reusability
- **State Management**: Used Pinia for centralized state with proper typing
- **Error Handling**: Implemented comprehensive error states with retry functionality
- **Type Safety**: Leveraged TypeScript throughout the application
- **Routing**: Used file-based routing with unplugin-vue-router

### Code Quality
- ESLint configured for Vue 3 and TypeScript
- TypeScript strict mode enabled
- Consistent code formatting
- Modular component structure

## API Integration

The application integrates with the SpaceX API:
- Base URL: `https://api.spacexdata.com/v4/rockets`
- Error handling for API failures
- Loading states during data fetching
- Data transformation for UI display

## Evaluation Criteria

This submission demonstrates:
- Clean, maintainable code structure
- Proper separation of concerns
- Effective state management
- Comprehensive error handling
- Type safety throughout the application
- Responsive UI implementation
- Modern Vue 3 best practices