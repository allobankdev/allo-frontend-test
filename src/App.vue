<template>
  <v-app>
    <v-app-bar elevation="2" color="surface">
      <v-app-bar-title>
        <v-icon icon="mdi-rocket-launch" color="primary" class="mr-2" />
        <span class="font-weight-bold">SpaceX</span>
        <span class="text-medium-emphasis"> Rocket Explorer</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
