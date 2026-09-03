<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none text-white">
          SpaceX Rockets
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
//
</script>
