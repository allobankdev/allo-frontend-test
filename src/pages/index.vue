<template>
  <v-app>
    <v-layout class="h-screen">
      <v-app-bar
        class="bg-indigo"
        title="Rocket Punch Allo SpaceX"
        elevation="1"
      />
      <v-main class="overflow-y-auto">
        <v-container fluid class="pt-6">
          <RocketList />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import RocketList from './rocket/RocketList.vue'
</script>
