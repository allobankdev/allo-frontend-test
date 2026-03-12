<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>
        <router-link to="/rockets" class="text-decoration-none text-white d-flex align-center">
          <v-icon icon="mdi-rocket-launch" class="mr-2" />
          SpaceX Rockets
        </router-link>
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
