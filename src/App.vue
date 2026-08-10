<template>
  <v-app>
    <!-- Persistent top navigation bar -->
    <v-app-bar color="grey-darken-4" elevation="2">
      <v-container class="d-flex align-center py-0 h-100">
        <!-- Clean text link perfectly aligned with main container -->
        <router-link to="/" class="text-decoration-none text-white d-flex align-center" style="cursor: pointer;">
          <v-icon color="blue-lighten-2" class="mr-2">mdi-rocket-launch</v-icon>
          <span class="font-weight-bold text-h6">Allo SpaceX</span>
        </router-link>
      </v-container>
    </v-app-bar>

    <!-- Main dynamic content area -->
    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Global app shell logic placeholder
</script>

<style scoped>
/* Smooth micro-animation for aesthetics */
.v-btn {
  transition: opacity 0.2s ease-in-out;
}
.v-btn:hover {
  opacity: 0.8;
}
</style>
