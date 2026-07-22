<template>
  <div
    v-if="isLoading"
    class="d-flex justify-center align-center py-12"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </div>
  
  <div
    v-else-if="isError"
    class="d-flex flex-column align-center justify-center py-12"
  >
    <v-icon
      color="error"
      size="64"
      class="mb-4"
    >
      mdi-alert-circle
    </v-icon>
    <h3 class="text-h5 text-error mb-2">
      Something went wrong
    </h3>
    <p class="text-body-1 mb-4">
      {{ errorMessage || 'Failed to fetch data' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
  
  <template v-else-if="isSuccess">
    <slot />
  </template>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage?: string;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
