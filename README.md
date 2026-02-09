# SpaceX Rockets Application

Aplikasi web untuk melihat informasi roket-roket SpaceX.

**Dibuat oleh:** Raymond Tjahyadi

---

## Deskripsi Project

Aplikasi ini dibuat menggunakan Vue 3 dengan TypeScript dan Vuetify sebagai UI framework. Aplikasi mengambil data dari SpaceX API dan menampilkannya dalam bentuk list dan detail.

### Teknologi yang Digunakan:
- Vue 3 (Composition API)
- TypeScript
- Vuetify 3
- Pinia (State Management)
- Vue Router
- Axios
- Vite

---

## Cara Menjalankan

### Install Dependencies
```bash
npm install
```

### Jalankan Development Server
```bash
npm run dev
```

Buka browser dan akses: `http://localhost:3000`

### Build untuk Production
```bash
npm run build
```

---

## Fitur

### Halaman List
- Menampilkan semua roket dari SpaceX API
- Filter berdasarkan status (Active/Inactive)
- Pencarian roket
- Tambah roket baru (simulasi)

### Halaman Detail
- Informasi lengkap roket
- Gambar roket
- Spesifikasi (cost per launch, country, first flight, dll)

---

## Struktur Folder

```
src/
├── components/      # Komponen reusable
├── pages/          # Halaman aplikasi
├── stores/         # Pinia store
├── services/       # API service
├── types/          # TypeScript types
└── main.ts         # Entry point
```

---

## Catatan

- Fitur "Add Rocket" adalah simulasi karena SpaceX API tidak support POST
- Data yang ditambahkan hanya tersimpan di browser memory
