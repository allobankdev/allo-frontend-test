<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" flat>
      <v-app-bar-title>
        <RouterLink to="/" class="app-title">
          <v-icon icon="mdi-rocket-launch" class="mr-2" />
          Rocket Explorer
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-title {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
</style>
