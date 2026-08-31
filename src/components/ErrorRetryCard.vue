<template>
  <v-card class="pa-6 mx-auto text-center border-dashed my-8" max-width="500" elevation="2" rounded="lg">
    <v-icon color="error" size="64" class="mb-4">mdi-alert-circle-outline</v-icon>
    <h3 class="text-h6 font-weight-bold mb-2">Failed to Load Rocket Data</h3>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message || 'An unexpected network error occurred while connecting to the SpaceDevs Launch API.' }}
    </p>
    <v-btn
      color="error"
      variant="flat"
      size="large"
      rounded="pill"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry Connection
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
