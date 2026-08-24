<template>
  <v-card class="pa-8 text-center my-6" elevation="2" rounded="lg">
    <v-icon icon="mdi-alert-circle-outline" color="error" size="64" class="mb-4" />
    <h2 class="text-h5 font-weight-bold mb-2">Unable to Load Rocket Data</h2>
    <p class="text-body-1 text-medium-emphasis mb-6">
      {{ message || 'An unexpected error occurred while communicating with the Launch Library API.' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      size="large"
      variant="flat"
      @click="$emit('retry')"
    >
      Retry Request
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
