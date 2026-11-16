<script setup lang="ts">
/**
 * AppHeader.vue
 *
 * Small application bar shared by every screen.
 */
</script>

<template>
  <v-app-bar
    border
    color="surface"
    flat
  >
    <v-app-bar-title class="font-weight-bold">
      <router-link
        class="text-decoration-none text-high-emphasis d-inline-flex align-center ga-2"
        to="/"
      >
        <v-icon
          color="primary"
          icon="mdi-rocket-launch"
        />
        Allo Rockets
      </router-link>
    </v-app-bar-title>

    <v-btn
      prepend-icon="mdi-format-list-bulleted"
      to="/"
      variant="text"
    >
      Rockets
    </v-btn>
  </v-app-bar>
</template>
