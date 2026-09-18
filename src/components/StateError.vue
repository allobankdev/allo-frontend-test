<template>
  <div class="text-center py-16 px-4">
    <v-icon
      icon="mdi-alert-circle-outline"
      color="error"
      size="80"
      class="mb-4"
    />
    <h3 class="text-h5 font-weight-bold mb-2 text-error">
      Failed to Load Data
    </h3>
    <p
      class="text-body-1 text-medium-emphasis mb-6 mx-auto"
      style="max-width: 540px;"
    >
      {{ message || 'An unexpected error occurred while fetching information from the server.' }}
    </p>

    <v-btn
      color="primary"
      size="large"
      prepend-icon="mdi-refresh"
      elevation="2"
      class="text-none font-weight-bold"
      @click="$emit('retry')"
    >
      Retry Again
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
