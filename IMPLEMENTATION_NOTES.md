# Implementation Notes

Dokumen ini merangkum fitur yang ditambahkan dan perubahan yang dibuat untuk menyelesaikan Allo Bank Frontend Technical Assignment.

## Requirement yang Diimplementasikan

### Rocket list screen

- Menampilkan daftar rocket dari Launch Library 2 API.
- Menampilkan gambar, nama lengkap, nama singkat, dan deskripsi setiap rocket.
- Menyediakan pencarian berdasarkan nama rocket dan nama lengkap.
- Menampilkan jumlah rocket yang sesuai dengan hasil filter.
- Menyediakan empty state ketika tidak ada hasil pencarian.

### Add new rocket

- Menyediakan dialog untuk menambahkan rocket baru.
- Field yang tersedia:
  - Rocket name
  - Full name
  - Description
  - Launch cost
  - Maiden flight
  - Image URL
- Validasi dilakukan pada field wajib.
- Rocket baru langsung muncul di bagian paling atas daftar.
- Data rocket custom disimpan di `localStorage`, sehingga tetap tersedia setelah browser di-refresh.

### Rocket detail screen

- Setiap rocket dapat dibuka dengan mengklik card.
- Halaman detail menampilkan:
  - Gambar rocket
  - Full name
  - Nama rocket
  - Deskripsi
  - Cost per launch
  - Country
  - First flight
- Nilai yang kosong ditampilkan sebagai `Unknown` atau fallback text yang sesuai.

### API integration

- Menggunakan Launch Library 2 API versi `2.2.0`.
- Endpoint daftar rocket:

  `GET /config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`

- Endpoint detail rocket:

  `GET /config/launcher/:id/`

- API client dipisahkan di `src/services/api.ts`.
- Request rocket dipisahkan di `src/services/rocket.service.ts`.

## State Management

State management dimigrasikan ke Pinia.

File utama:

- `src/store/rocketStore.ts`
- `src/plugins/index.ts`

State yang dikelola:

- `rockets`
- `isLoading`
- `error`

Actions yang tersedia:

- `setRockets`
- `setLoading`
- `setError`
- `addRocket`
- `getLocalRocket`

Pinia dipilih karena merupakan state management resmi yang direkomendasikan untuk Vue 3 dan memiliki dukungan TypeScript yang baik.

## Loading, Error, dan Retry State

- Loading state ditampilkan ketika aplikasi sedang mengambil data dari API.
- Error state menampilkan pesan error dari request.
- Tombol retry tersedia untuk mengulangi request API.
- Empty state digunakan ketika request berhasil tetapi tidak ada rocket yang cocok dengan pencarian.

Komponen terkait:

- `src/components/common/LoadingState.vue`
- `src/components/common/ErrorState.vue`

## Fallback Image

Ditambahkan asset fallback lokal:

- `public/rocket-fallback.svg`

Fallback digunakan ketika:

- Field `image_url` kosong.
- URL gambar tidak dapat dimuat.
- Gambar mengalami error pada list card.
- Gambar mengalami error pada halaman detail.

Dengan fallback lokal, tampilan tidak bergantung pada layanan placeholder eksternal.

## Routing dan Component Structure

Router digunakan untuk dua screen utama:

- `/` untuk rocket list.
- `/:id` untuk rocket detail.

Komponen utama:

- `RocketCard.vue`
- `RocketFilter.vue`
- `AddRocketDialog.vue`
- `LoadingState.vue`
- `ErrorState.vue`

Logic reusable dipisahkan ke composable:

- `useRockets.ts`
- `useRocketDetail.ts`

## UI dan Responsive Design

UI dibuat dengan Vuetify dan custom CSS untuk memberikan visual neo-brutalist bertema rocket archive.

Perubahan visual meliputi:

- Hero section untuk halaman Rocket Archive.
- High-contrast color palette.
- Border tebal dan hard shadow pada card.
- Responsive grid untuk desktop, tablet, dan mobile.
- Visual accent bertema rocket dan pixel flame.
- Search field dengan styling custom.
- Detail card dengan informasi yang terstruktur.

Animasi entrance dan stagger list menggunakan GSAP sebagai enhancement tambahan. Animasi tidak mengubah alur atau requirement utama aplikasi.

## Styling

Penggunaan SCSS tidak diwajibkan oleh assignment. File `src/styles/settings.scss` tetap tersedia sebagai konfigurasi override Vuetify, sedangkan styling utama berada pada:

- Scoped style di page dan component.
- Theme configuration di `src/plugins/vuetify.ts`.
- Global style di `src/App.vue`.

## Dependency Tambahan

Dependency yang ditambahkan untuk mendukung implementasi:

- `pinia` untuk state management.
- `gsap` untuk animasi UI.

## Validation

Validasi yang sudah dijalankan:

```bash
npm run type-check
npm run build
npx eslint src/pages/index.vue
```

Hasil validasi berhasil dan production bundle dapat dibuat.
