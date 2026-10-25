<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <div class="text-center">
      <v-icon size="100" color="primary">mdi-rocket-launch</v-icon>
      <h1 class="text-h3 mt-4 mb-2">SpaceX Rockets</h1>
      <p class="text-h6 mb-6">Explore the fleet of SpaceX rockets</p>
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-rocket"
        to="/rockets"
      >
        View Rockets
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  //
</script>
