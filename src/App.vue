<template>
  <v-app>
    <v-main class="app-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
  .app-background {
    background: rgb(var(--v-theme-background));
  }
</style>
