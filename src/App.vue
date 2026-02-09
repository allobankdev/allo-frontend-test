<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title class="d-flex align-center">
        <v-icon size="large" class="mr-2">mdi-rocket-launch</v-icon>
        <span class="text-h5 font-weight-bold">SpaceX Rockets</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// No script needed for now
</script>
