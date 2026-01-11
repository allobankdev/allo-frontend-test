<template>
  <v-app>
    <v-layout class="h-screen">
      <v-main class="overflow-y-auto">
        <v-container fluid class="pt-6">
          <RocketList />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import RocketList from './rockets/RocketList.vue'
</script>
