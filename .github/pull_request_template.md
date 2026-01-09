# Allo Bank FE Technical Assignment — Rocket Explorer

## Summary
<!-- Jelaskan 1–3 kalimat tujuan PR ini -->
- Implement Rocket Explorer (Rocket List + Rocket Detail) menggunakan SpaceX API dengan routing, state management, dan UI states (loading/error/retry/success).

## What's Included
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
- Image handling: Filter problematic URLs (imgur.com) with base64 fallback

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
