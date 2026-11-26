<template>
  <v-container class="py-16 text-center">
    <v-icon
      color="medium-emphasis"
      icon="mdi-rocket-launch-outline"
      size="64"
    />
    <h1 class="text-h5 mt-4">
      Page not found
    </h1>
    <p class="text-medium-emphasis mt-2">
      The page you're looking for doesn't exist.
    </p>
    <v-btn
      class="mt-6"
      color="primary"
      :to="{ name: '/rockets/' }"
      variant="flat"
    >
      Back to rockets
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
  //
</script>
