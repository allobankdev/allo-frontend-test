# Allo Bank Frontend Technical Assignment

A Rocket Catalogue application built with Vue 3 and TypeScript as part of the Allo Bank Frontend Technical Assignment.

The application displays SpaceX launch vehicles using data from Launch Library 2, with rocket search, custom rocket creation, and individual rocket detail pages.

## Table of Contents

- [Original Assignment](#original-assignment)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture and Design Decisions](#architecture-and-design-decisions)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing and Verification](#testing-and-verification)
- [API Integration](#api-integration)
- [Submission](#submission)

---

## Original Assignment

In this assignment, you are required to create a website that displays rockets. The website consists of two main screens: a rocket list screen and a rocket detail screen.

### Functional Requirements

- Display a list of rockets, including each rocket's image, name, and description.
- Allow users to filter rockets on the list screen.
- Allow users to add a new rocket. Since the API is read-only, custom rockets only need to appear in the running application.
- Allow users to view rocket details by selecting a rocket from the list. The detail screen should display the rocket image, name, description, cost per launch, country, and first flight.
- Ensure both screens remain functional when some rocket data is missing.

### API

Use the Launch Library 2 API by The Space Devs for rocket data.

Documentation: https://thespacedevs.com/llapi

**Rocket list**

```http
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
```

**Single rocket**

```http
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/
```

The assignment specifies:

- `mode=detailed` to retrieve the description and other detail fields.
- `limit=20` to retrieve all 13 SpaceX rockets in a single request instead of using the default page size of 10.
- API version `2.2.0` as the required version for this assignment.

| Requirement     | API Field                   |
| --------------- | --------------------------- |
| Rocket image    | `image_url`                 |
| Rocket name     | `full_name`                 |
| Description     | `description`               |
| Cost per launch | `launch_cost`               |
| Country         | `manufacturer.country_code` |
| First flight    | `maiden_flight`             |

Some rockets may have missing values for `launch_cost`, `maiden_flight`, and `image_url`. The application should handle these cases gracefully.

**API host and rate limits**

The assignment uses `lldev.thespacedevs.com` during development. It provides the same data with a more generous rate limit than the production host, `ll.thespacedevs.com`.

### Non-Functional Requirements

- Use the Launch Library 2 API to retrieve rocket data.
- Implement routing.
- Implement state management.
- Use component lifecycles appropriately.
- Build reusable components.
- Implement loading, failure/retry, and success UI states.
- Display a loading indicator while waiting for API responses.
- Allow users to retry when an error occurs.
- Display the retrieved data when the API request succeeds.

### Nice-to-Have Characteristics

- Responsive design.
- Readable, clean, and maintainable source code.

The assignment prioritizes code quality and maintainability over elaborate visual design.

---

## Solution Overview

This project implements the requested Rocket Catalogue using Vue 3, TypeScript, and Vuetify.

Rocket data is retrieved from Launch Library 2 through a dedicated API service. The application separates page presentation, reusable components, state management, API communication, data types, and utility functions.

The list endpoint was verified on November 12, 2026. It returned 13 SpaceX rocket records in a single request with no additional page.

Custom rockets are maintained in application memory and are not submitted to the read-only API.

## Features

### Rocket Catalogue

- Display SpaceX rockets retrieved from Launch Library 2.
- Show rocket images, names, countries, and descriptions.
- Search rockets by name, description, or country.
- Display the number of matching rockets.
- Provide loading, error, retry, and empty states.
- Support refreshing the catalogue data.

### Rocket Details

- Navigate to an individual rocket detail page.
- Retrieve rocket information using the rocket ID.
- Display rocket image, name, and description.
- Display cost per launch, country, and first flight.
- Handle missing information without breaking the page.
- Support direct navigation to a rocket detail URL.

### Custom Rocket Creation

- Add a custom rocket through a form dialog.
- Validate form input before submission.
- Support optional rocket information.
- Display custom rockets in the catalogue.
- Keep custom rockets in application memory only.

Custom rockets are not persisted to a database or external API. They are lost when the application state is reset, such as after a full page reload.

### Image Handling

- Reusable rocket image component.
- Display a fallback when an image URL is unavailable.
- Display a fallback when an image fails to load.
- Support changing image sources.

### Responsive Interface

The catalogue and detail screens provide responsive layouts for desktop, tablet, and mobile screen sizes.

---

## Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| Vue 3            | Frontend framework                |
| TypeScript       | Static typing                     |
| Vuetify 3        | UI component framework            |
| Vue Router       | Application routing               |
| Vite 6           | Development server and build tool |
| Vitest           | Unit testing                      |
| Vue Test Utils   | Component testing                 |
| ESLint           | Code linting                      |
| Launch Library 2 | Rocket data API                   |
| Sass             | Styling customization             |

### Runtime Requirements

- Node.js `^20.0.0 || ^22.0.0 || >=24.0.0` (based on the Vitest runtime requirement).
- npm.

The project was developed and verified using Node.js `20.19.0` and npm `11.2.0`.

---

## Project Structure

```text
allo-frontend-test/
├── public/
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── components/
│   │   ├── README.md
│   │   ├── RocketCard.vue
│   │   ├── RocketFilter.vue
│   │   ├── RocketFormDialog.vue
│   │   ├── RocketImage.vue
│   │   └── __tests__/
│   │       ├── RocketFilter.spec.ts
│   │       ├── RocketFormDialog.spec.ts
│   │       └── RocketImage.spec.ts
│   ├── composables/
│   │   ├── useRockets.ts
│   │   └── __tests__/
│   │       └── useRockets.spec.ts
│   ├── pages/
│   │   ├── README.md
│   │   ├── index.vue
│   │   └── rockets/
│   │       └── [id].vue
│   ├── plugins/
│   │   ├── index.ts
│   │   ├── README.md
│   │   └── vuetify.ts
│   ├── router/
│   │   └── index.ts
│   ├── services/
│   │   ├── rocketService.ts
│   │   └── __tests__/
│   │       └── rocketService.spec.ts
│   ├── styles/
│   │   ├── README.md
│   │   └── settings.scss
│   ├── types/
│   │   └── rocket.ts
│   └── utils/
│       ├── format.ts
│       └── __tests__/
│           └── format.spec.ts
├── .browserslistrc
├── .editorconfig
├── .gitignore
├── components.d.ts
├── env.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── typed-router.d.ts
├── vite.config.mts
└── README.md
```

### Important Directories

| Directory      | Responsibility                                            |
| -------------- | --------------------------------------------------------- |
| `components/`  | Reusable UI components                                    |
| `composables/` | Shared reactive state and application logic               |
| `pages/`       | Catalogue and rocket detail pages                         |
| `plugins/`     | Application plugin registration and Vuetify configuration |
| `router/`      | Router configuration                                      |
| `services/`    | API communication and data mapping                        |
| `styles/`      | Global Sass and Vuetify style configuration               |
| `types/`       | TypeScript data interfaces                                |
| `utils/`       | Reusable utility functions                                |

Unit tests are organized in `__tests__` directories alongside the related implementation.

---

## Architecture and Design Decisions

### Separation of Responsibilities

The application separates its main responsibilities:

- **Pages:** Handle screen-level presentation and interactions.
- **Components:** Provide reusable UI elements.
- **Composables:** Manage shared reactive state and catalogue operations.
- **Services:** Handle API requests and map API responses into application data.
- **Types:** Define application and API data structures.
- **Utilities:** Provide reusable formatting functions.

### State Management

The `useRockets` composable manages the shared rocket catalogue state.

It handles:

- Rocket data.
- Loading and error states.
- Search queries and filtered results.
- Fetching and refreshing rocket data.
- Adding custom rockets.
- Finding rockets by ID.

The composable also prevents duplicate concurrent catalogue requests and preserves custom rockets when API data is refreshed.

### API Service

API communication is centralized in `rocketService.ts`.

The service provides:

- `getRockets()` to retrieve the rocket catalogue.
- `getRocketById(id)` to retrieve an individual rocket.

API responses are mapped into a consistent application-level `Rocket` type.

### Missing Data Handling

Some API fields may be null or unavailable.

The application handles missing values by:

- Using fallback text for unavailable descriptions and names.
- Displaying a fallback image when the image URL is missing or fails to load.
- Handling unavailable rocket details without breaking the interface.

### Custom Rocket Data

Custom rockets use a dedicated ID prefix and are stored in the composable's reactive state.

They are client-side only and are not sent to Launch Library 2.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Youuzzi/allo-frontend-test.git
```

### 2. Navigate to the Project Directory

```bash
cd allo-frontend-test
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal. The development server is configured to use port `3000`.

---

## Available Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Start the development server           |
| `npm run build`      | Run type checking and production build |
| `npm run build-only` | Run the production build only          |
| `npm run preview`    | Preview the production build           |
| `npm run type-check` | Run TypeScript type checking           |
| `npm run lint`       | Run ESLint with automatic fixes        |
| `npm test`           | Run the unit test suite                |
| `npm run test:watch` | Run Vitest in watch mode               |

**Note:** `npm run lint` uses ESLint's `--fix` option and may automatically modify files. To check lint issues without automatically fixing files, use:

```bash
npx eslint .
```

---

## Testing and Verification

The project includes unit tests for:

- Rocket filtering.
- Rocket form validation and interactions.
- Rocket image fallback behavior.
- Rocket composable state and operations.
- Rocket API service.
- Formatting utilities.

### Latest Local Verification

The following checks passed during local development:

| Check                    | Result                              |
| ------------------------ | ----------------------------------- |
| Unit tests               | 41 tests passed across 6 test files |
| ESLint                   | Passed                              |
| TypeScript type checking | Passed                              |
| Production build         | Passed                              |

Run the checks locally using:

```bash
npm test
npx eslint .
npm run build
```

These results describe the local verification performed during development. They do not represent a guarantee that every external API request will always succeed.

---

## API Integration

**Provider:** Launch Library 2 — The Space Devs

**API Version:** `2.2.0`

**Base URL:**

```text
https://lldev.thespacedevs.com/2.2.0
```

### Rocket Catalogue Endpoint

```http
GET /config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
```

### Rocket Detail Endpoint

```http
GET /config/launcher/:id/
```

### Data Mapping

| Application Property | API Field                   |
| -------------------- | --------------------------- |
| `id`                 | `id`                        |
| `name`               | `full_name`                 |
| `description`        | `description`               |
| `imageUrl`           | `image_url`                 |
| `launchCost`         | `launch_cost`               |
| `country`            | `manufacturer.country_code` |
| `firstFlight`        | `maiden_flight`             |

The catalogue endpoint was checked on November 12, 2026. The API returned 13 records, with no next page.

The application uses the `lldev.thespacedevs.com` development endpoint specified in the assignment.

---

## Submission

The original assignment requests the following submission process:

1. Fork the original repository.
2. Implement the solution on a dedicated feature branch.
3. Submit the solution through a Pull Request to the original repository's main branch.
4. Complete the technical test submission form.

**Technical Test Submission Form:**
https://forms.gle/YAbAQxPuJAdDYmRW7

---

Thank you for reviewing this project.
