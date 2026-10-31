# Allo Bank Frontend Technical Assignment — SpaceX Rocket Fleet Web Application

[![Vue 3](https://img.shields.io/badge/Vue-3.4.31-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-4.1.0-ffd859.svg)](https://pinia.vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.6.14-E5A93C.svg)](https://vuetifyjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646cff.svg)](https://vitejs.dev/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Code Quality](https://img.shields.io/badge/ESLint-0%20Errors-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A production-grade, responsive, and type-safe SpaceX Rocket Fleet web application developed for the **Allo Bank Frontend Technical Assignment**. The application allows users to browse SpaceX rocket configurations, filter catalog entries in real-time, inspect granular vehicle specifications, add new custom rockets with client-side persistence, and gracefully recover from API network failures.

---

## 1. Candidate & Submission Information

* **Candidate Name:** Abu Dujanah Siregar
* **Position Applied:** Java Developer (Spring Boot & Vue.js)
* **Client / Assessor:** PT Allo Bank Indonesia Tbk
* **Recruitment Partner:** TechTiera Services Indonesia
* **GitHub Profile:** [`DujanahSr`](https://github.com/DujanahSr)
* **Fork Repository:** [https://github.com/DujanahSr/allo-frontend-test](https://github.com/DujanahSr/allo-frontend-test)
* **Dedicated Feature Branch:** `feat/allo-spacex`
* **Target Upstream Repository:** `allobankdev/allo-frontend-test` (`main`)

---

## 2. Requirement Fulfillment Matrix

| No | Requirement Category | Specific Assignment Brief | Implementation Details | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Rocket Catalog** | Show list of rockets with image, name, and description. | Implemented in `src/pages/index.vue` and `RocketCard.vue` using Launch Library 2 API v2.2.0. | **Compliant** |
| 2 | **Catalog Filtering** | Filter rockets on the list screen. | Live search query (name & description) combined with quick category toggle (`Semua`, `SpaceX`, `Kustom`). | **Exceeded** |
| 3 | **Add New Rocket** | Add custom rocket client-side (appears in running app). | Modal form in `AddRocketDialog.vue` with validation and persistent synchronization via `localStorage`. | **Exceeded** |
| 4 | **Rocket Details** | Show image, name, description, launch cost, country, first flight. | Detailed view in `src/pages/rockets/[id].vue` with metric stat cards and technical metadata bar. | **Compliant** |
| 5 | **Missing Data Safety** | Screens must display correctly when values are missing. | Custom formatters in `src/utils/formatters.ts` gracefully fallback null fields to `"N/A"` and render SVG placeholders. | **Compliant** |
| 6 | **API Specification** | Use Launch Library 2 API v2.2.0 (`mode=detailed&limit=20`). | Standardized in `src/stores/rocket.ts` fetching all 13 SpaceX rockets in a single request. | **Compliant** |
| 7 | **Routers** | Implement client-side routing. | Configured via `vue-router` in `src/router/index.ts` with route error handlers and dynamic `/rockets/:id` routes. | **Compliant** |
| 8 | **State Management** | Implement centralized state management. | Implemented via Pinia (`src/stores/rocket.ts`) managing cache, custom entries, and reactive filters. | **Compliant** |
| 9 | **Component Architecture** | Component-based modular development (+ points). | Modular components (`RocketCard`, `RocketSkeleton`, `ErrorState`, `AddRocketDialog`). | **Compliant** |
| 10 | **UI States** | Loading (Skeleton), Fail/Retry, and Success states. | Implemented `RocketSkeleton.vue`, `ErrorState.vue` with interactive Retry action, and empty catalog state. | **Compliant** |
| 11 | **Responsive Design** | Mobile-first and desktop responsive layout. | Fully responsive Vuetify flex grid tested from 320px narrow mobile screens to 1240px desktop displays. | **Compliant** |
| 12 | **Clean Code Standards** | Readable, clean, maintainable, zero emoji, type-safe. | 100% TypeScript, strict ESLint compliance, and unified corporate iconography (Material Design Icons). | **Compliant** |

---

## 3. Architectural Decisions & Technical Rationale

### A. Intelligent In-Memory Caching (API Rate-Limit Protection)
* **Context:** The Space Devs Launch Library 2 API enforces a strict anonymous quota of **15 requests per hour**. Navigating between list and detail views without caching rapidly triggers HTTP 429 (Too Many Requests).
* **Decision:** The Pinia store (`src/stores/rocket.ts`) implements in-memory caching with a `hasFetched` flag. Initial payload data is preserved; subsequent navigations reuse cached state instantly without network overhead. A manual retry trigger (`force = true`) is provided for error recovery.

### B. Client-Side Persistence via LocalStorage
* **Context:** The technical specification requires that added rockets appear in the running application without a backend write endpoint.
* **Decision:** Rather than relying solely on transient memory that resets upon browser refresh, custom rockets are serialized to browser `localStorage` (`allo_spacex_custom_rockets`). On application boot, local custom entries are prepended to the fleet, tagged with a gold `Custom` badge, and made filterable.

### C. Graceful Data Degradation & Null Safety
* **Context:** Multiple SpaceX rockets in the Launch Library 2 dataset lack values for `launch_cost`, `maiden_flight`, or `image_url`.
* **Decision:** Utility helpers (`formatCurrency`, `formatDate`) in `src/utils/formatters.ts` utilize `Intl.NumberFormat` and `Intl.DateTimeFormat` with null-coalescing fallbacks returning `"N/A"`. Broken or missing image URLs automatically render an aerospace SVG placeholder (`FALLBACK_ROCKET_IMAGE`) without UI shifts.

### D. Corporate Design System (Deep Obsidian & Warm Gold)
* **Context:** Template-default Material Blue was replaced to establish a distinctive, aerospace-grade identity while adhering to the brief's constraint on readable/clean code over decorative excess.
* **Decision:** The application employs a unified palette:
  * **Background:** Deep Obsidian Black (`#0B0E14`)
  * **Surface:** Dark Cosmic Card Surface (`#111622`)
  * **Primary Accent:** Warm Gold / Aerospace Amber (`#E5A93C`)
  * **Iconography:** 100% Material Design Icons (`mdi-*`) with zero unicode emojis, ensuring enterprise consistency.

---

## 4. Project Structure

```text
allo-frontend-test/
├── public/
│   ├── favicon.ico              # Legacy favicon
│   └── hero-bg.jpg              # High-resolution SpaceX launchpad hero asset
├── src/
│   ├── assets/                  # Static assets and images
│   ├── components/
│   │   ├── AddRocketDialog.vue  # Modal dialog with reactive form validation
│   │   ├── ErrorState.vue       # Dedicated error recovery component with Retry
│   │   ├── RocketCard.vue       # Modular card with image fallback and metadata
│   │   └── RocketSkeleton.vue   # Skeleton loader for asynchronous data fetching
│   ├── pages/
│   │   ├── index.vue            # Rocket catalog, hero banner, metrics & filter
│   │   └── rockets/
│   │       └── [id].vue         # Rocket specification detail view
│   ├── plugins/
│   │   ├── index.ts             # Plugin registration (Pinia, Vuetify, Router)
│   │   └── vuetify.ts           # Vuetify 3 theme and color palette definition
│   ├── router/
│   │   └── index.ts             # Type-safe Vue Router configuration
│   ├── stores/
│   │   └── rocket.ts            # Pinia store with caching, filter & localStorage
│   ├── types/
│   │   └── rocket.ts            # TypeScript interfaces (Rocket, Manufacturer, etc.)
│   ├── utils/
│   │   └── formatters.ts        # Currency, date, and image fallback utilities
│   ├── App.vue                  # Main application shell with navbar and footer
│   └── main.ts                  # Application entry point
├── index.html                   # HTML template with custom title & SVG favicon
├── package.json                 # Project dependencies and script commands
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Technical documentation and submission guide
```

---

## 5. How to Build and Run Locally

### Prerequisites
* **Node.js:** v18.x, v20.x, or v22+ (tested on Node.js v23.3.0)
* **Package Manager:** npm v9+ or v10+

### Step-by-Step Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DujanahSr/allo-frontend-test.git
   cd allo-frontend-test
   ```

2. **Checkout the feature branch:**
   ```bash
   git checkout feat/allo-spacex
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

### Quality Verification Commands

* **Production Build & Type Check:**
  ```bash
  npm run build
  ```
  *Executes `vue-tsc --build --force` and `vite build`. Must pass with 0 errors.*

* **Code Linting & Style Enforcement:**
  ```bash
  npm run lint
  ```
  *Executes ESLint validation. Must pass with 0 errors and 0 warnings.*

* **Production Bundle Preview:**
  ```bash
  npm run preview
  ```

---

## 6. Official Submission Checklist

- [x] Forked repository created under [`DujanahSr/allo-frontend-test`](https://github.com/DujanahSr/allo-frontend-test)
- [x] Dedicated feature branch created: `feat/allo-spacex`
- [x] Launch Library 2 API v2.2.0 integration verified (all 13 SpaceX rockets)
- [x] List screen with live search and category filtering verified
- [x] Detail screen with complete specifications and technical footer verified
- [x] Client-side rocket creation with validation and `localStorage` persistence verified
- [x] 3 UI states (Skeleton loading, Error recovery with Retry, Success catalog) verified
- [x] Null and missing data safety with formatters verified
- [x] Responsive layout verified across mobile (320px, 425px) and desktop breakpoints
- [x] Zero unicode emojis; enterprise Material Design Icons throughout
- [x] `npm run build` passes 100% without TypeScript compilation errors
- [x] `npm run lint` passes 100% without ESLint warnings
- [x] Pull Request prepared for submission to `allobankdev/allo-frontend-test:main`
