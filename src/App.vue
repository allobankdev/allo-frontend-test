<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@use "./styles/settings.scss" as *;

.main {
  background-color: $bg-dark;
  min-height: 100vh;
  padding: 0 $spacing-lg;
}
</style>
