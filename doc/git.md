1) PR Template (description + checklist)

Buat file: .github/pull_request_template.md

# Allo Bank FE Technical Assignment — Rocket Explorer

## Summary
<!-- Jelaskan 1–3 kalimat tujuan PR ini -->
- Implement Rocket Explorer (Rocket List + Rocket Detail) menggunakan SpaceX API dengan routing, state management, dan UI states (loading/error/retry/success).

## What’s Included
- [ ] Rocket List Screen (image, name, description)
- [ ] Filter rockets (client-side)
- [ ] Add new rocket (client-side)
- [ ] Rocket Detail Screen (image, name, description, cost/country/first flight)
- [ ] Routing (Vue Router)
- [ ] State management (Pinia)
- [ ] UI states: Loading / Error + Retry / Success
- [ ] Componentization (base/ui/feature components)
- [ ] Responsive adjustments
- [ ] Documentation updates

## Implementation Notes
<!-- Poin teknis penting untuk reviewer -->
- Data source: SpaceX API `/v4/rockets`
- Store: `rocketStore` menangani rockets, loading, error, filter, dan user-added rockets
- Error handling: tombol Retry memanggil ulang action fetch
- Filtering: computed list berdasarkan state `filter`

## Screenshots / Recording (Optional)
<!-- Lampirkan jika ada -->

## How to Test
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173/`
4. Verify Rocket List loads (loading → success)
5. Try filter (name/country)
6. Add new rocket (client-side) and ensure it appears in list
7. Click rocket card → detail page `/rockets/:id`
8. Simulate API failure (optional) and test Retry button

## Checklist (Must)
- [ ] SpaceX API digunakan sebagai sumber data roket
- [ ] Router: `/` dan `/rockets/:id` berfungsi
- [ ] Pinia digunakan untuk state management
- [ ] Lifecycle digunakan untuk fetch data (mounted)
- [ ] UI state lengkap: loading, error + retry, success
- [ ] Codebase component-based dan maintainable

## Checklist (Nice to Have)
- [ ] Responsive (mobile/desktop)
- [ ] Struktur folder konsisten
- [ ] Dokumentasi lengkap (README/TDD/Checklist)

2) Git workflow: commit per task di branch seno_dev
A. Checkout branch
git checkout -b seno_dev

B. Commit per task (urutan rekomendasi + message siap pakai)

Gunakan urutan ini supaya PR mudah direview.

Scaffold project

git add .
git commit -m "chore: scaffold vue app with vite"


Setup routing

git add .
git commit -m "feat(router): add routes for rocket list and rocket detail"


Setup state management (Pinia)

git add .
git commit -m "feat(store): create rocketStore with loading and error state"


API service (Axios)

git add .
git commit -m "feat(api): add spacex service for rockets endpoint"


Rocket List + UI states

git add .
git commit -m "feat(list): render rocket list with loading/error/retry/success states"


Filter rockets

git add .
git commit -m "feat(filter): add client-side rocket filtering"


Add new rocket (client-side)

git add .
git commit -m "feat(add): add form to create rocket locally"


Rocket Detail screen

git add .
git commit -m "feat(detail): implement rocket detail view"


Component split + cleanup

git add .
git commit -m "refactor(components): split base/ui/feature components and cleanup"


Docs + PR template

git add .
git commit -m "docs: add README, TDD, checklist, and PR template"

C. Push ke origin
git push -u origin seno_dev

3) “PR per commit per task” — cara yang paling masuk akal

Secara praktik, 1 PR dengan commit terpisah per task sudah memenuhi “per commit per task” dan reviewer bisa review commit-by-commit.

Jika Anda benar-benar butuh PR terpisah per task, Anda harus buat branch terpisah per task (lebih berat). Untuk technical test, saya sarankan 1 PR saja.

4) Final PR Description (siap tempel di GitHub PR)

Silakan copy-paste ini sebagai deskripsi PR:

PR Title (rekomendasi)

feat: Allo Bank Rocket Explorer (Vue 3 + Pinia + Router)

PR Body
## Summary
This PR delivers the Rocket Explorer SPA for Allo Bank FE technical assignment. It consumes SpaceX `/v4/rockets` API and provides two main screens: Rocket List and Rocket Detail, with proper routing, centralized state management, and complete UI states (loading/error/retry/success).

## Key Features
- Rocket List screen:
  - Displays rocket image, name, and description
  - Client-side filtering (by name/country)
  - Add new rocket (client-side only)
- Rocket Detail screen:
  - Displays image, name, description, cost per launch, country, and first flight
- Robust UI states:
  - Loading indicator while fetching API
  - Error state with Retry button to re-fetch data
  - Success state displaying fetched results
- Architecture:
  - Vue Router for navigation (`/` and `/rockets/:id`)
  - Pinia store for global state (data + UI states)
  - Component-based structure (base/ui/feature components)
  - API service abstraction for maintainability

## Implementation Notes
- Data fetching is triggered via lifecycle hook (mounted) on Rocket List view.
- `rocketStore` manages rockets, user-added rockets, filter term, loading, and error state.
- Filtering is computed-driven to keep rendering performant and logic predictable.
- Add-new-rocket is local-only (no API mutation), as required.

## How to Test
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173/`
4. Verify Rocket List loads (loading → success)
5. Try filtering rockets by name/country
6. Add a new rocket and verify it appears in the list
7. Click a rocket card to open detail page (`/rockets/:id`)
8. (Optional) Simulate network/API failure and verify Retry works

## Checklist
- [x] Uses SpaceX API `/v4/rockets`
- [x] Implements routing (`/`, `/rockets/:id`)
- [x] Implements state management (Pinia)
- [x] Uses lifecycle for data fetching
- [x] UI states: Loading / Error + Retry / Success
- [x] Component-based design
- [x] Documentation updated (README + TDD + Checklist + PR template)
