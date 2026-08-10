# Allo Bank Frontend Technical Assignment - Rocket Viewer

This repository contains my solution for the Allo Bank frontend technical test. It's a web application built with Vue 3 that displays a list of rockets using the SpaceX API.

## How to Run the Project

1. **Install dependencies**:
   Make sure you are in the `allo-frontend-test` directory, then run:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open the local URL provided in your terminal (usually `http://localhost:3000`) in your browser.

## Tech Stack
- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (Strict mode)
- **Vuetify 3** (UI components and responsive grid)
- **Pinia** (State management)
- **Axios** (API client)

## Key Implementation Details

I focused on writing clean, readable, and maintainable code. Here are some architectural decisions made during development:

- **Component-Based Architecture:** The UI is split into smaller, focused components like `RocketCard`, `RocketFilterBar`, and `AddRocketModal` to keep the main pages clean and adhere to the single responsibility principle.
- **Robust UI States:** The SpaceX API can sometimes be unstable (e.g., returning 525 errors). To handle this gracefully, I implemented reusable `LoadingSkeleton` and `ErrorState` components. Users will see a clear error message with a "Retry" button instead of a broken page.
- **Optimistic UI:** Since the SpaceX API is read-only, adding a new rocket is handled locally via Pinia. The form simulates a brief network delay before instantly updating the grid and showing a success toast notification.
- **Responsive Design:** The layout uses Vuetify's grid system to adapt to mobile screens. For instance, the "Add Rocket" modal automatically expands to fullscreen on mobile devices to prevent keyboard clipping and provide a better UX.

---

### Original Assignment Requirements

In this assignment, you’re assigned to create a website that displays rockets. This website only has two screens: rocket list screen and rocket detail screen. Here are the requirements:

#### Functional Requirements
- As a user, I want to see a list of rockets in the rocket list screen (Show each rocket image, rocket name, and rocket description)
- As a user, I want to be able to filter the rockets in the rocket list screen
- As a user, I want to be able to add the new rocket in the rocket list screen
- As a user, I want to be able to see the rocket detail by clicking a rocket in the rocket list screen (Show rocket image, rocket name, rocket description, cost per launch, country, first flight)

#### Non-Functional Requirements
- Use Space-X API (https://github.com/r-spacex/SpaceX-API) for getting the rocket data
- Implement routers
- Implement state management
- Implement lifecycles
- Create components based will be + points
- UI states (Loading, Fail/Retry, and Success)
- Show loading when waiting response from API
- If an error occurred, user can retry by pressing retry button
- Show result when get response from API

#### Nice to have characteristics
Responsive design
You don’t need to worry about the detailed design, we’re not interested in your artistic prowess (for now), put your efforts on creating a readable/clean/maintainable source code.

#### Submission
1.  **Fork** this repository.
2.  Implement your solution on a dedicated feature branch (e.g., `feat/allo-spacex`).
3.  When complete, submit your solution via a **Pull Request (PR)** back to the main repository.
4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/nZKQ2EjTCPfAKHog7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.
