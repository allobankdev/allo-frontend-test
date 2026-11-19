<template>
  <v-card
    class="pa-8 my-6 text-center mx-auto"
    max-width="600"
    rounded="lg"
    variant="outlined"
    color="error"
  >
    <v-icon
      icon="mdi-alert-circle-outline"
      size="64"
      color="error"
      class="mb-4"
    />
    <h3 class="text-h5 font-weight-bold mb-2">
      Unable to Load Rockets
    </h3>
    <p class="text-body-1 text-medium-emphasis mb-6">
      {{ message || 'An error occurred while communicating with the Launch Library API.' }}
    </p>

    <div class="d-flex justify-center ga-3">
      <v-btn
        color="error"
        variant="flat"
        prepend-icon="mdi-refresh"
        size="large"
        @click="$emit('retry')"
      >
        Retry Request
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
