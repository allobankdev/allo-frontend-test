# Allo Bank – Rocket Explorer

Frontend Technical Assignment untuk menampilkan data roket SpaceX menggunakan **Vue 3**.

Aplikasi ini dirancang sebagai **Single Page Application (SPA)** dengan fokus pada kualitas kode, arsitektur yang bersih, serta penerapan state management, routing, dan UI state yang baik.

---

## 📌 Product Overview (PRD Summary)

**Rocket Explorer** adalah aplikasi web sederhana dengan dua layar utama:

1. **Rocket List Screen**
   Menampilkan daftar roket dari SpaceX API, dilengkapi fitur filter dan penambahan roket (client-side).

2. **Rocket Detail Screen**
   Menampilkan detail lengkap dari satu roket yang dipilih.

### 🎯 Tujuan Produk

* Menampilkan informasi roket SpaceX secara terstruktur
* Memberikan pengalaman pengguna yang jelas dengan UI state (loading, error, success)
* Menjadi sarana evaluasi kemampuan frontend (Vue, state, routing, lifecycle)

---

## 🧩 Fitur Utama

### Rocket List

* Menampilkan:

  * Gambar roket
  * Nama roket
  * Deskripsi roket
* Filter roket (client-side)
* Tambah roket baru (client-side)
* Navigasi ke halaman detail

### Rocket Detail

* Gambar roket
* Nama roket
* Deskripsi roket
* Cost per launch
* Country
* First flight

---

## ⚙️ Technical Design Summary (TDD)

### Technology Stack

* **Framework:** Vue 3 (Composition API)
* **State Management:** Pinia
* **Routing:** Vue Router
* **HTTP Client:** Axios
* **Build Tool:** Vite
* **API:** SpaceX REST API

### Architecture Overview

```
UI Components
 ↓
Pinia Store (State)
 ↓
API Service (Axios)
 ↓
SpaceX API
```

### Routing

| Path           | Description          |
| -------------- | -------------------- |
| `/`            | Rocket List Screen   |
| `/rockets/:id` | Rocket Detail Screen |

### State Management

* Centralized state menggunakan **Pinia**
* Menyimpan:

  * Data roket
  * Loading state
  * Error state
  * Filter value

### UI State Handling

* **Loading:** Ditampilkan saat menunggu response API
* **Error:** Pesan error + tombol retry
* **Success:** Data berhasil ditampilkan

---

## 📂 Project Structure

```
src/
├── assets/
├── components/
│   ├── base/
│   ├── rockets/
│   └── ui/
├── views/
├── router/
├── stores/
├── services/
├── utils/
├── App.vue
└── main.js
```

Dokumentasi struktur lengkap tersedia di:

* `docs/VUE_FOLDER_STRUCTURE_Allo_Rocket_Explorer.md`

---

## ▶️ How to Run

```bash
npm install
npm run dev
```

Akses aplikasi di:

```
http://localhost:5173
```

---

## 🧪 How to Test

1. Buka halaman utama
2. Pastikan daftar roket tampil
3. Uji filter roket
4. Tambahkan roket baru (client-side)
5. Klik roket untuk melihat detail
6. Simulasikan error API dan uji tombol retry

---

## 📑 Documentation

Dokumen pendukung tersedia di folder `docs/`:

* `PRD.md`
* `TDD_Allo_Rocket_Explorer.md`
* `CHECKLIST_Allo_Rocket_Explorer.md`
* `VUE_FOLDER_STRUCTURE_Allo_Rocket_Explorer.md`

---

## 🚀 Submission Flow

* Branch kerja: `seno_dev`
* Feature branch contoh: `feat/allo-spacex`
* Pull Request ke branch `main`
* PR template tersedia di `.github/pull_request_template.md`

---

## 📝 Notes

* Penambahan roket bersifat **client-side only** (tidak disimpan ke API)
* Fokus utama pada arsitektur, keterbacaan kode, dan best practice frontend

---

**Author:** Frontend Candidate
**Assignment:** Allo Bank Frontend Technical Test
