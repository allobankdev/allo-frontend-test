<template>
  <v-app>
    <v-app-bar elevation="1" density="comfortable">
      <v-container class="d-flex align-center py-0" max-width="1280">
        <router-link to="/" class="d-flex align-center text-decoration-none text-white ga-2">
          <v-icon icon="mdi-rocket" color="primary" size="28" />
          <span class="text-h6 font-weight-bold tracking-wide">SPACEX EXPLORER</span>
        </router-link>

        <v-spacer />

        <v-btn
          variant="text"
          prepend-icon="mdi-format-list-bulleted"
          to="/"
        >
          Rockets
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="text-center d-flex flex-column py-4" elevation="1">
      <div class="text-caption text-medium-emphasis">
        Powered by Launch Library 2 API | Allo Bank Frontend Challenge
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
</script>

<style>
body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
