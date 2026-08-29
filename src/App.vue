<template>
  <v-app>
    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style>
.app-main {
  background: rgb(var(--v-theme-background));
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Cleaner focus styles */
*:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>
