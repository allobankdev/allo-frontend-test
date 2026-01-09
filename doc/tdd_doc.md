📘 Technical Design Document (TDD)

Project: Allo Bank – Rocket Explorer
Frontend Framework: Vue 3
Architecture Style: SPA (Single Page Application)
Document Version: 1.0

1. Overview

Dokumen ini menjelaskan desain teknis aplikasi Rocket Explorer, termasuk arsitektur frontend, struktur folder, pengelolaan state, routing, serta strategi UI state.

Aplikasi terdiri dari dua halaman utama:

Rocket List

Rocket Detail

2. Technology Stack
Layer	Teknologi
Framework	Vue 3 (Composition API)
Routing	Vue Router
State Management	Pinia
HTTP Client	Axios
Styling	CSS / SCSS
API	SpaceX REST API
Build Tool	Vite
3. Application Architecture
User
 ↓
UI Components (Vue)
 ↓
State Management (Pinia)
 ↓
API Service (Axios)
 ↓
SpaceX API

4. Routing Design
Route	Component	Description
/	RocketListView	Halaman daftar roket
/rockets/:id	RocketDetailView	Halaman detail roket
5. State Management Design (Pinia)
Rocket Store Responsibilities

Menyimpan daftar roket

Menyimpan status loading

Menyimpan error state

Menyimpan data roket yang ditambahkan user

Meng-handle filter

State Structure
state: {
  rockets: [],
  loading: false,
  error: null,
  filter: ''
}

6. API Integration
Endpoint
GET https://api.spacexdata.com/v4/rockets

Data Handling

Fetch data saat RocketListView mounted

Error handling menggunakan try/catch

Retry trigger memanggil ulang API

7. UI State Handling
State	UI
Loading	Spinner / Loading text
Error	Error message + Retry button
Success	Rocket list / detail tampil
8. Component Design
Atomic Components

BaseButton

BaseInput

LoadingState

ErrorState

Feature Components

RocketCard

RocketFilter

AddRocketForm

9. Lifecycle Usage

onMounted() → fetch rocket list

watch() → handle filter changes

computed() → filtered rocket list

10. Error Handling Strategy

Global try/catch di service

Error message disimpan di store

Retry button memanggil ulang fetch action

11. Performance Considerations

Reusable components

Computed properties untuk filtering

Client-side state only (no backend)

12. Security Considerations

Read-only public API

No authentication required

No sensitive data stored

13. Conclusion

Desain ini memastikan:

Kode bersih & maintainable

Separation of concerns

Mudah dikembangkan lebih lanjut

✅ Implementation Checklist (Per Requirement)
Functional Requirements
Rocket List Screen

 Fetch rocket data dari SpaceX API

 Menampilkan:

 Gambar roket

 Nama roket

 Deskripsi roket

 Klik rocket → navigasi ke detail

Filter Rocket

 Input filter tersedia

 Filter berdasarkan nama / country

 Filtering client-side

Add New Rocket

 Form tambah roket

 Data masuk ke state (Pinia)

 Tidak memanggil API (client-side only)

Rocket Detail Screen

 Routing dynamic /rockets/:id

 Menampilkan:

 Image

 Name

 Description

 Cost per launch

 Country

 First flight

Non-Functional Requirements
Architecture

 Vue Router diimplementasikan

 Pinia sebagai state management

 Lifecycle hooks digunakan

 Component-based architecture

UI States

 Loading state

 Error state

 Retry button

 Success state

Nice to Have

 Responsive layout

 Clean folder structure

 Readable code

📂 Struktur Folder Vue 3 (Recommended)
src/
│
├── assets/
│   └── styles/
│       └── main.css
│
├── components/
│   ├── base/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   │
│   ├── rockets/
│   │   ├── RocketCard.vue
│   │   ├── RocketFilter.vue
│   │   └── AddRocketForm.vue
│   │
│   ├── ui/
│   │   ├── LoadingState.vue
│   │   └── ErrorState.vue
│
├── views/
│   ├── RocketListView.vue
│   └── RocketDetailView.vue
│
├── router/
│   └── index.js
│
├── stores/
│   └── rocketStore.js
│
├── services/
│   └── spacexApi.js
│
├── utils/
│   └── formatters.js
│
├── App.vue
└── main.js
