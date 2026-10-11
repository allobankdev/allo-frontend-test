<template>
  <v-app>
    <v-app-bar
      elevation="1"
      flat
    >
      <v-app-bar-title>
        <router-link
          class="text-decoration-none text-high-emphasis"
          to="/"
        >
          Allo SpaceX Rockets
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
