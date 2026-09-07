<template>
  <v-app>
    <!-- App Navigation Header -->
    <v-app-bar color="indigo-darken-3" elevation="2" density="comfortable">
      <template #prepend>
        <v-icon icon="mdi-rocket-launch" size="large" class="ml-2 text-amber-accent-2"></v-icon>
      </template>

      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none text-white font-weight-bold text-h6">
          SpaceX Rockets
        </router-link>
        <span class="text-caption ml-2 text-indigo-lighten-3 d-none d-sm-inline">
          Launch Library 2
        </span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon="mdi-github"
        variant="text"
        href="https://github.com/allobankdev/allo-frontend-test"
        target="_blank"
        title="View Repository"
      ></v-btn>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="bg-grey-lighten-5">
      <v-container class="py-6 min-h-screen">
        <router-view />
      </v-container>
    </v-main>

    <!-- App Footer -->
    <v-footer class="bg-grey-darken-4 text-white text-caption text-center py-3 d-flex flex-column">
      <div>
        SpaceX Rocket Technical Assignment &copy; {{ new Date().getFullYear() }} — Built with Vue 3, Vuetify 3 & Pinia
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.min-h-screen {
  min-height: calc(100vh - 120px);
}
</style>
