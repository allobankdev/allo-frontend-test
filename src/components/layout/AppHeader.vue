<script setup lang="ts">
import { APP_NAME } from '@/config'
</script>

<template>
  <v-app-bar
    class="app-header"
    color="background"
    flat
  >
    <v-container class="page-container d-flex align-center py-0">
      <router-link
        to="/"
        class="brand d-flex align-center ga-2 text-decoration-none"
        aria-label="Rocket Explorer home"
      >
        <v-avatar
          color="primary"
          size="36"
          variant="tonal"
        >
          <v-icon
            icon="mdi-rocket-launch"
            size="20"
          />
        </v-avatar>
        <span class="text-subtitle-1 font-weight-bold text-high-emphasis">{{ APP_NAME }}</span>
      </router-link>
      <v-spacer />
      <span class="text-caption text-medium-emphasis d-none d-sm-inline">
        Data by The Space Devs
      </span>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  backdrop-filter: blur(8px);
}
</style>
