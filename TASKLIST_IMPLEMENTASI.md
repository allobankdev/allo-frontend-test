# Task List Implementasi - Allo Frontend Rocket App

Dokumen ini memecah requirement di `README.md` menjadi langkah implementasi per file agar eksekusi lebih cepat.

## Step 1 - Setup Fondasi Data

- [ ] `src/types/rocket.ts`
  - Buat type/interface `Rocket` berdasarkan data SpaceX API.
  - Tambahkan type untuk UI state: `idle | loading | success | error`.

- [ ] `src/services/api.ts`
  - Buat fungsi reusable fetch (base URL + error handler).
  - Base URL: `https://api.spacexdata.com/v4`.

- [ ] `src/services/rocketService.ts`
  - Buat fungsi `getRockets()` untuk ambil list rocket.
  - Normalisasi field agar konsisten dipakai di UI.

## Step 2 - Implement State Management

- [ ] `src/store/rocketStore.ts` (buat folder `store`)
  - Simpan state: `rockets`, `filteredRockets`, `selectedRocket`, `status`, `error`.
  - Buat action:
  - `fetchRockets()`
  - `retryFetchRockets()`
  - `setFilter(keyword)`
  - `addRocket(payload)`
  - `setSelectedRocketById(id)`
  - Pastikan ada state Loading, Error/Retry, Success.

- [ ] `src/main.ts`
  - Daftarkan state management (`pinia`) ke aplikasi.

- [ ] `src/plugins/index.ts`
  - Pastikan plugin store ikut dipakai bersama router + vuetify.

## Step 3 - Routing dan Struktur Halaman

- [ ] `src/pages/index.vue`
  - Jadikan halaman utama list rocket.
  - Hapus pemakaian `HelloWorld`.

- [ ] `src/pages/rocket/[id].vue` (buat folder/file)
  - Halaman detail rocket berdasarkan param route `id`.
  - Tampilkan image, name, description, cost per launch, country, first flight.

- [ ] `src/router/index.ts`
  - Tetap gunakan auto routing dari `unplugin-vue-router`.
  - Tambahkan guard ringan jika data detail belum ada (fallback ke fetch/select by id).

## Step 4 - Komponen UI Reusable

- [ ] `src/components/RocketCard.vue`
  - Tampilkan image, name, description.
  - Klik card arahkan ke halaman detail.

- [ ] `src/components/RocketFilter.vue`
  - Input untuk filter list rocket (by name/description).
  - Emit keyword ke page/store.

- [ ] `src/components/AddRocketForm.vue`
  - Form tambah rocket baru (minimal: name, description, image).
  - Validasi basic required field.

- [ ] `src/components/UiState.vue`
  - Komponen untuk `loading`, `error + retry`, dan `empty/success`.

## Step 5 - Integrasi Halaman List

- [ ] `src/pages/index.vue`
  - Susun layout:
  - Header judul
  - `RocketFilter`
  - `AddRocketForm`
  - `UiState`
  - Grid `RocketCard`
  - Jalankan `fetchRockets()` saat lifecycle `onMounted`.
  - Hubungkan tombol retry ke `retryFetchRockets()`.

## Step 6 - Integrasi Halaman Detail

- [ ] `src/pages/rocket/[id].vue`
  - Ambil route param `id`.
  - Cari data di store, jika belum ada lakukan fetch lalu resolve id.
  - Tampilkan state loading/error/success untuk halaman detail.

## Step 7 - Rapikan App Shell

- [ ] `src/App.vue`
  - Pastikan hanya memuat `router-view` dengan layout Vuetify yang rapi.

- [ ] `src/components/HelloWorld.vue`
  - Hapus file ini jika sudah tidak dipakai.

- [ ] `components.d.ts` dan `typed-router.d.ts`
  - Jalankan ulang generate typing setelah file page/component final.

## Step 8 - Validasi Requirement README

- [ ] Cek Functional:
  - List rocket tampil.
  - Filter berfungsi.
  - Add rocket berfungsi.
  - Klik rocket membuka detail.
  - Detail menampilkan semua field wajib.

- [ ] Cek Non-Functional:
  - Data dari SpaceX API.
  - Router dipakai.
  - State management dipakai.
  - Lifecycle (`onMounted`) dipakai.
  - Ada komponen terpisah.
  - Loading / Error+Retry / Success ada semua.

- [ ] Cek responsive:
  - Mobile dan desktop tetap readable.

## Step 9 - Finalisasi

- [ ] Jalankan:
  - `npm.cmd install`
  - `npm.cmd run dev`
  - `npm.cmd run build`
  - `npm.cmd run lint`

- [ ] Commit bertahap:
  - Commit 1: setup services + store
  - Commit 2: pages + router
  - Commit 3: components + UI states
  - Commit 4: polishing + README update
