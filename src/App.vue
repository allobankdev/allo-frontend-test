<!-- Layout utama aplikasi: app bar dengan tautan ke daftar rocket, lalu halaman aktif dari router. -->
<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="comfortable"
    >
      <v-app-bar-title>
        <router-link
          class="text-white text-decoration-none d-inline-flex align-center ga-2"
          to="/"
        >
          <v-icon icon="mdi-rocket-launch" />
          Rocket SpaceX
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
