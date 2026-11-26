<template>
  <v-app>
    <v-app-bar color="surface" flat class="app-bar">
      <v-container class="page-container d-flex align-center py-0">
        <router-link to="/" class="app-brand text-decoration-none">
          <v-icon icon="mdi-rocket-launch" color="primary" size="28" />
          <span class="text-h6 font-weight-bold">Allo Space</span>
        </router-link>

        <v-spacer />

        <v-btn to="/" variant="text" prepend-icon="mdi-format-list-bulleted" class="text-none">
          Rockets
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="app-main">
      <router-view />
    </v-main>

    <v-footer class="app-footer text-caption text-medium-emphasis">
      <v-container
        class="page-container d-flex flex-column flex-sm-row align-center justify-space-between ga-2 py-4"
      >
        <span>Rocket data from Launch Library 2 by The Space Devs.</span>
        <span>Built for the Allo Bank frontend technical assignment.</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
// Application shell: navigation, routed content, and footer.
</script>
