<template>
  <v-container
    class="d-flex flex-column align-center justify-center text-center py-16"
    style="min-height: 60vh;"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="64"
      class="mb-4 text-on-surface-variant"
    />
    <h1 class="text-h5 font-weight-bold mb-2">
      Page not found
    </h1>
    <p class="text-body-2 text-on-surface-variant mb-6">
      We couldn't find the page you were looking for.
    </p>
    <v-btn
      to="/"
      color="primary"
      variant="flat"
      prepend-icon="mdi-arrow-left"
    >
      Back to rocket list
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
//
</script>