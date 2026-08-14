<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="comfortable"
    >
      <v-app-bar-title>
        <router-link
          class="text-white text-decoration-none"
          to="/"
        >
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
  
</script>
