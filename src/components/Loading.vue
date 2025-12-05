<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <v-container
    class="d-flex flex-column align-center justify-center py-10 text-center"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
    />
    <p class="mt-4">
      {{ text || "Loading..." }}
    </p>
  </v-container>
</template>
