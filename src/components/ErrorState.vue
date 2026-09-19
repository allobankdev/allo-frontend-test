<template>
  <v-card
    class="pa-6 text-center mx-auto my-6"
    max-width="500"
    elevation="2"
    border
  >
    <v-icon
      icon="mdi-alert-circle-outline"
      color="error"
      size="48"
      class="mb-3"
    />
    <h3 class="text-h6 font-weight-bold text-error mb-2">
      {{ title || 'Failed to Load Data' }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-4">
      {{ message || 'An unexpected error occurred while communicating with the rocket API.' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      variant="elevated"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
