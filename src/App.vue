<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>
        <router-link
          to="/"
          class="text-white text-decoration-none d-flex align-center"
        >
          <v-icon class="mr-2">mdi-rocket-launch</v-icon>
          SpaceX Rockets
        </router-link>
      </v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-home" to="/"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Empty setup script
</script>

<style>
.text-decoration-none {
  text-decoration: none;
}

.v-toolbar__content {
  padding-left: 16px !important;
  padding-right: 16px !important;
}
</style>
