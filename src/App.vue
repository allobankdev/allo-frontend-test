<template>
  <v-app>
    <v-app-bar
      class="u-divider"
      color="surface"
      height="72"
    >
      <v-container class="d-flex align-center">
        <router-link
          to="/"
          class="d-flex align-center text-decoration-none text-high-emphasis"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="22"
            class="mr-2"
          />
          <span class="text-subtitle-1 font-weight-bold">SpaceX Rockets</span>
        </router-link>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
//
</script>
