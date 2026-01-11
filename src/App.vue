<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>
:root {
  /* Warna Utama: Deep Space Blue */
  --v-theme-primary: #3f51b5;
  --v-theme-primary-darken-1: #303f9f;

  /* Background: Sangat Gelap (Hampir Hitam) */
  --v-theme-surface: #121212;
  --v-theme-background: #0a0e14;

  /* Aksentuasi: Electric Cyan */
  --v-theme-secondary: #00e5ff;
}

/* Override gaya Card agar terlihat lebih futuristik/glassmorphism */
.v-card {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, border-color 0.2s ease !important;
}

.v-card:hover {
  transform: translateY(-4px);
  border-color: #00e5ff !important; /* Warna secondary saat hover */
}

/* Bikin App Bar (Header) lebih transparan */
.v-toolbar {
  background: rgba(10, 14, 20, 0.8) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>
