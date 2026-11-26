<template>
  <v-app class="app-shell">
    <AppHeader />

    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Root application shell
</script>

<style scoped>
.app-shell {
  background: radial-gradient(circle at top center, #111c36 0%, #070b14 55%, #05080f 100%);
}

.app-main {
  min-height: 100vh;
}
</style>
