<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="comfortable"
      flat
    >
      <v-app-bar-title>
        <router-link
          class="app-title"
          :to="{ name: '/rockets/' }"
        >
          <v-icon
            class="me-2"
            icon="mdi-rocket-launch"
          />
          RocketS
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

<style scoped>
  .app-title {
    color: inherit;
    text-decoration: none;
  }
</style>
