# SpaceX Explorer - Allo Bank Frontend Challenge

A modern frontend application built with **Vue**, **TypeScript**, and **Vuetify** to explore SpaceX rockets. This project demonstrates state management, component architecture, routing, and unit testing.

## Tech Stack

- **Framework:** Vue 3 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Vuetify
- **State Management:** Pinia
- **Routing:** Vue Router
- **HTTP Client:** Axios
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint + Prettier

---

## Features

### Functional

- ✅ **Rocket List:** Displays rockets with images, names, and descriptions.
- ✅ **Search/Filter:** Real-time filtering of rockets by name.
- ✅ **Rocket Details:** Dedicated view showing cost, country, first flight date, and full description.
- ✅ **Add Rocket:** Users can add custom rockets via a form with validation (persisted in local state).
- ✅ **Smart Images:** Uses user-provided URLs or falls back to high-quality Unsplash placeholders.

### Non-Functional

- ✅ **State Management:** Global store (Pinia) handles data fetching and local updates.
- ✅ **Responsive Design:** Fully responsive grid layout using Vuetify.
- ✅ **Error Handling:** Robust loading states and error retry mechanisms.
- ✅ **Unit Testing:** Tests for Store logic and Component rendering.

---

## Setup & Installation

**Prerequisites:** Node.js (v18+ recommended)

1.  **Clone the repository**

    ```bash
    git clone https://github.com/inganta23/allo-frontend-test.git
    cd allo-spacex
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Running Tests

This project uses **Vitest** for unit testing.

```bash
npm run test
```
