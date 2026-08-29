<template>
  <v-app>
    <v-app-bar flat>
      <v-app-bar-title>SpaceX Rockets</v-app-bar-title>

      <v-spacer />

      <v-btn to="/" variant="text" prepend-icon="mdi-rocket-launch-outline">
        Rockets
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
