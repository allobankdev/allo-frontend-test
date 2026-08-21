# SpaceX Rocket Explorer

A web application built for exploring SpaceX rockets and launch vehicles, developed with Vue 3, TypeScript, Vite, Pinia, and Vuetify. The user interface is crafted in strict accordance with the **Apple Human Interface Guidelines (HIG)** design system principles (Clarity, Deference, and Depth).

---

## Core Features

- **Apple HIG Design Tokens & Theme Engine**:
  - Full implementation of iOS dynamic typography scale, 8pt spacing grid, continuous corner radii, and 44px minimum tap targets.
  - Built-in theme switcher supporting Light mode and True Black (`#000000`) Dark mode with `localStorage` persistence and automatic system preference detection.
  - Smooth 400ms surface color transitions using cubic-bezier easing.
- **SpaceX API Integration & State Architecture**:
  - Connected to the Launch Library 2 REST API (`/config/launcher/` with `manufacturer__name=SpaceX&mode=detailed`).
  - Pinia state management implementing a 4-state UI machine (`idle`, `loading`, `error`, `success`) with in-memory caching to eliminate redundant network requests.
- **Local Storage Persistence**:
  - Locally created rockets are persisted to browser `localStorage` (`hig_local_rockets`), ensuring user-created rocket entries survive page reloads and browser restarts.
  - Theme mode preference is persisted to `localStorage` (`hig-theme`), retaining Light or Dark mode preferences across sessions.
- **Home Screen & Grid Layout**:
  - Collapsing iOS Large Title navigation bar with action controls aligned on the same horizontal baseline.
  - iOS-style pill search filter with animated cancel behavior and instant query matching.
  - Responsive grid layout (`cols="12" sm="6" md="4" lg="3"`) with consistent 16px gaps and uniform card heights.
- **Detail Screen**:
  - Instantaneous route navigation with zero-delay rendering.
  - Media presentation bounded to the main content container (`max-width: 720px`) with rounded continuous corners.
  - Grouped Information List Rows with 0.5px hairline inset separators and null-safe data handling.
- **Add Rocket Workflow & Validation**:
  - Responsive creation dialog (Dialog on desktop, Bottom Sheet with drag handle on mobile).
  - Supports all 6 official fields: Rocket Name (`full_name`), Description (`description`), Cost per Launch (`launch_cost`), Country (`country_code`), First Flight (`maiden_flight`), and Image URL (`image_url`).
  - Form validation with reactive status checks across all fields.
  - Smart real-time date auto-formatting (`YYYY-MM-DD`) upon typing raw digits without external library overhead.
- **Smooth Navigation & Scroll Physics**:
  - Hardware-accelerated smooth scrolling with momentum touch support.
  - Static route chunk resolution preventing blank screen transitions.

---

## Local Storage Persistence & State Architecture

The application handles both remote API data and user-created data seamlessly:

| Storage Key | Type | Description |
|---|---|---|
| `hig_local_rockets` | `JSON Array` | Stores user-created rockets locally. Loaded into Pinia `localRockets` state on app start and merged with API results. |
| `hig-theme` | `string` (`'light'` \| `'dark'`) | Stores user-selected theme. Automatically overrides system preference when set. |

### Data Flow

```
[User Action: Add Rocket] ──> [Validation Pass] ──> [Pinia store.addLocalRocket]
                                                               │
                                         ┌─────────────────────┴─────────────────────┐
                                         ▼                                           ▼
                                [localStorage Sync]                         [Reactive UI Update]
                           ('hig_local_rockets' JSON)                   (Instant List & Detail View)
```

---

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript (Strict mode, fully typed API schemas)
- **Build Tool**: Vite 8
- **UI Framework**: Vuetify 3/4
- **State Management**: Pinia
- **Routing**: Vue Router 4 (HTML5 History mode)
- **Icons**: Material Design Icons (`@mdi/font`)
- **Package Manager**: npm

---

## Project Structure

```
task-alto-frontend/
├── public/
├── src/
│   ├── assets/              # Static vector assets
│   ├── components/
│   │   ├── common/          # Reusable HIG components (Navbar, EmptyState, ErrorState, LoadingState)
│   │   └── rocket/          # Rocket feature components (RocketCard, RocketFilterBar, AddRocketDialog)
│   ├── composables/         # Shared hooks (useRocketDetail, useTheme)
│   ├── pages/
│   │   ├── index.vue        # Rocket list & search page
│   │   └── rockets/
│   │       └── [id].vue     # Rocket detail page
│   ├── plugins/             # Vuetify, Pinia, and Router registration
│   ├── services/            # API client wrapper and rocket service endpoints
│   ├── stores/              # Pinia store for rocket data and filter state
│   ├── styles/              # HIG design tokens and global SCSS variables
│   ├── types/               # TypeScript interfaces matching API schema
│   ├── App.vue              # Root application component
│   └── main.ts              # Application bootstrap entry point
├── env.d.ts                 # Ambient type declarations
├── package.json             # Project dependencies and npm scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.mts          # Vite configuration
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

Type check the code and compile the production bundle:

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

### Type Checking

Run standalone TypeScript validation:

```bash
npm run type-check
```

---

## API Specification & Field Mapping

The application interfaces with Launch Library 2 API (`https://lldev.thespacedevs.com/2.2.0`).

| Requirement | Interface Field | Data Type | Notes |
|---|---|---|---|
| Rocket Name | `full_name` | `string` | Primary display title |
| Description | `description` | `string \| null` | Overview text with 2-line clamp on cards |
| Rocket Image | `image_url` | `string \| null` | URL with gradient icon fallback when unavailable |
| Cost Per Launch | `launch_cost` | `string \| null` | Formatted as USD currency string |
| Country | `manufacturer.country_code` | `string` | Manufacturer country identifier (e.g., USA) |
| First Flight | `maiden_flight` | `string \| null` | Date string formatted as `YYYY-MM-DD` |

---

## Apple HIG Design System Implementation

### Design Tokens (`src/styles/hig-tokens.scss`)

- **Typography Scale**:
  - Large Title: `34px / 700` (Line height: `41px`)
  - Title 1: `28px / 700` (Line height: `34px`)
  - Title 2: `22px / 700` (Line height: `28px`)
  - Headline: `17px / 600` (Line height: `22px`)
  - Body: `17px / 400` (Line height: `22px`)
  - Subhead: `15px / 400` (Line height: `20px`)
  - Footnote: `13px / 400` (Line height: `18px`)
  - Caption: `12px / 400` (Line height: `16px`)
- **Semantic Colors**:
  - System Blue: `#007AFF` (Light) / `#0A84FF` (Dark)
  - System Green: `#34C759` (Light) / `#30D158` (Dark)
  - System Red: `#FF3B30` (Light) / `#FF453A` (Dark)
  - System Orange: `#FF9500` (Light) / `#FF9F0A` (Dark)
  - Background Primary: `#F2F2F7` (Light) / `#000000` (Dark)
  - Background Secondary: `#FFFFFF` (Light) / `#1C1C1E` (Dark)
  - Separator: `rgba(60, 60, 67, 0.22)` (Light) / `rgba(255, 255, 255, 0.15)` (Dark)
- **Spacing Grid**: 8pt grid (`4px`, `8px`, `16px`, `20px`, `24px`, `32px`, `48px`).
- **Interactive Tap Target**: Minimum `44px × 44px` across all buttons, form fields, and list items.
