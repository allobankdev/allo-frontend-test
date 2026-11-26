<template>
  <v-app-bar
    app
    class="app-header border-b"
    color="#0b1120"
    elevation="0"
    height="68"
  >
    <v-container
      class="d-flex align-center justify-space-between px-4"
      max-width="1200"
    >
      <router-link
        class="app-brand d-flex align-center text-decoration-none ga-3"
        to="/"
      >
        <v-avatar
          color="primary"
          rounded="lg"
          size="38"
          variant="tonal"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="22"
          />
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-subtitle-1 font-weight-bold text-white lh-tight">
            SpaceX Explorer
          </span>
          <span class="text-caption text-medium-emphasis d-none d-sm-inline">
            Launch Vehicle Catalog
          </span>
        </div>
      </router-link>

      <nav aria-label="Primary navigation">
        <v-btn
          color="primary"
          prepend-icon="mdi-view-grid-outline"
          rounded="lg"
          to="/"
          variant="tonal"
        >
          Rockets
        </v-btn>
      </nav>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
// Header shell component for SpaceX Explorer
</script>

<style scoped>
.app-header {
  border-color: rgba(148, 163, 184, 0.16) !important;
  backdrop-filter: blur(10px);
}

.lh-tight {
  line-height: 1.2;
}
</style>
