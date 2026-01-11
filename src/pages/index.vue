<template>
  <v-app>
    <v-layout class="h-screen">
      <v-app-bar
        color="surface-variant"
        title="Space X Rocket List"
        elevation="1"
      />

      <v-navigation-drawer permanent>
      </v-navigation-drawer>

      <v-navigation-drawer location="right" permanent>
      </v-navigation-drawer>

      <v-main class="overflow-y-auto">
        <v-container fluid class="pt-6">
          <RocketList />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import RocketList from '@/components/RocketList.vue'
</script>
