# Allo Bank Frontend Technical Assignment

In this assignment, you’re assigned to create a website that displays rockets. This website only has two screens: rocket list screen and rocket detail screen. Here are the requirements:

### Functional Requirements
- As a user, I want to see a list of rockets in the rocket list screen (Show each rocket image, rocket name, and rocket description)
- As a user, I want to be able to filter the rockets in the rocket list screen
- As a user, I want to be able to add the new rocket in the rocket list screen (the API is read-only, so the new rocket only needs to appear in the running app)
- As a user, I want to be able to see the rocket detail by clicking a rocket in the rocket list screen (Show rocket image, rocket name, rocket description, cost per launch, country, first flight)
- As a user, I want both screens to still display correctly when some rocket data is missing

### API

Use the Launch Library 2 API by The Space Devs for rocket data.
Docs: https://thespacedevs.com/llapi

Rocket list (returns all 13 SpaceX rockets in a single request):

    GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20

Single rocket:

    GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/

`mode=detailed` is required — without it the response omits `description`
and the other detail fields. `limit=20` is required too — the default page size
is 10, so without it you get 10 rockets and a `next` page instead of all 13.

**API version:** use `2.2.0` as shown above. The docs site now showcases
`2.3.0`, but `2.2.0` is still live with no announced end-of-life, and the field
names in the table below are the `2.2.0` ones. Don't migrate: `2.3.0` renames
the endpoint to `/2.3.0/launcher_configurations/` and moves several of these
fields (`image_url` becomes `image.image_url`, `manufacturer.country_code`
becomes a `manufacturer.country` array). Both versions return the same 13
rockets.

| Requirement      | Field                              |
| ---------------- | ---------------------------------- |
| rocket image     | `image_url`                        |
| rocket name      | `full_name`                        |
| description      | `description`                      |
| cost per launch  | `launch_cost`                      |
| country          | `manufacturer.country_code`        |
| first flight     | `maiden_flight`                    |

**Rate limit:** the API allows 15 requests/hour for anonymous users. Use the
`lldev.thespacedevs.com` host shown above during development — it serves the
same data with a far more generous limit. The production host,
`ll.thespacedevs.com`, will throttle you quickly.

Note that some rockets have missing values for `launch_cost`, `maiden_flight`,
and `image_url`.

### Non-Functional Requirements
- Use the Launch Library 2 API (see the API section above) for getting the rocket data
- Implement routers
- Implement state management
- Implement lifecycles
- Create components based will be + points
- UI states (Loading, Fail/Retry, and Success)
- Show loading when waiting response from API
- If an error occurred, user can retry by pressing retry button
- Show result when get response from API

### Nice to have characteristics
Responsive design
You don’t need to worry about the detailed design, we’re not interested in your artistic prowess (for now), put your efforts on creating a readable/clean/maintainable source code.

### Submission

1.  **Fork** this repository.

2.  Implement your solution on a dedicated feature branch (e.g., `feat/allo-spacex`).

3.  When complete, submit your solution via a **Pull Request (PR)** back to the main repository.
   
4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/YAbAQxPuJAdDYmRW7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.


---

## Rocket Explorer — Solution Documentation

### Overview

Rocket Explorer is a responsive web application developed as part of the Allo Bank Frontend Technical Assignment.

The application allows users to explore SpaceX rocket configurations, view rocket details, search and filter rockets, and add custom rockets locally.

### Technology Stack

- Vue 3
- TypeScript
- Vite
- Vuetify 3
- Pinia
- Vue Router
- Launch Library 2 API
- Browser localStorage

### Implemented Features

- Display SpaceX rockets with images, names, and descriptions
- Search rockets by name or description
- Filter rockets by country and active status
- View detailed information for individual rockets
- Add custom rockets through a validated form
- Persist custom rocket data using localStorage
- View custom rocket details without calling the external API
- Handle missing or unavailable rocket information
- Display loading, error, retry, and success states
- Display custom rockets even when the external API is unavailable
- Responsive layout for desktop and mobile devices

### Project Structure

```text
src/
├── components/
│   ├── AddRocketDialog.vue
│   ├── RocketCard.vue
│   └── RocketFilters.vue
├── pages/
│   ├── index.vue
│   └── rockets/
│       └── [id].vue
├── services/
│   ├── customRocketStorage.ts
│   ├── rocketApi.ts
│   └── rocketMapper.ts
├── stores/
│   └── rocketStore.ts
└── types/
    └── rocket.ts
```

### Installation

Requirements:
- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application is available at the local URL displayed in the terminal.

### Validation and Production Build

Run TypeScript validation:

```bash
npm run type-check
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Architecture and Design Decisions

**State Management**

Pinia manages rocket data, search queries, filters, and custom rockets.

**API Integration**

Launch Library 2 provides SpaceX rocket information. API responses are mapped into a consistent application model.

**Local Data Persistence**

Custom rockets are stored separately from API data and persisted using browser localStorage.

**Routing**

Vue Router handles navigation between the rocket list and detail screens.

**Error Handling**

The application supports loading indicators, error messages, retry actions, and fallback values for missing data.

**Request Cancellation**

AbortController is used to cancel obsolete API requests.

### Limitations

- Custom rockets are stored locally in the user's browser.
- Custom rockets are not synchronized between devices.
- Clearing browser storage removes locally created rockets.
- External rocket data depends on Launch Library 2 API availability.
```

## Kenapa saya menyarankan pendekatan ini?

| Aspek | Alasannya |
|---|---|
| README asli | Tetap mempertahankan spesifikasi dari Allo Bank |
| Solution Documentation | Memperlihatkan fitur yang benar-benar diimplementasikan |
| Project Structure | Mempermudah reviewer memahami arsitektur |
| Installation | Mempermudah reviewer menjalankan aplikasi |
| Design Decisions | Menunjukkan pertimbangan teknis di balik implementasi |

Ada satu poin yang menarik: **persyaratan resminya hanya meminta roket baru muncul di aplikasi yang sedang berjalan**. Implementasi kita lebih dari itu karena menggunakan `localStorage`, sehingga custom rocket tetap tersedia setelah browser di-refresh.

Ini nilai tambah, selama fungsi utama tetap sesuai persyaratan.

## Langkah berikutnya

Setelah menambahkan dokumentasi tersebut, jalankan:

```powershell
git branch --show-current
git status
```

Kirim hasilnya ke sini. Kita akan memeriksa branch serta file yang berubah, kemudian langsung melakukan **commit, push, dan membuat Pull Request** sesuai instruksi Allo Bank.

Satu hal penting: tautan Google Form pada README adalah `https://forms.gle/YAbAQxPuJAdDYmRW7`. Nanti gunakan tautan tersebut setelah Pull Request berhasil dibuat.