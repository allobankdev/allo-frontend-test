<template>
  <div
    v-if="loading"
    role="status"
    aria-live="polite"
    class="d-flex align-center ga-3 py-6"
  >
    <v-progress-circular indeterminate color="primary" />
    <span>{{ loadingLabel }}</span>
  </div>
  <v-alert
    v-else-if="error"
    type="error"
    variant="tonal"
    role="alert"
    class="my-4"
  >
    <p>{{ error }}</p>
    <v-btn
      v-if="retryable"
      class="mt-3"
      variant="outlined"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean;
    error?: string | null;
    loadingLabel?: string;
    retryable?: boolean;
  }>(),
  {
    loading: false,
    error: null,
    loadingLabel: "Memuat rocket…",
    retryable: true,
  },
);
defineEmits<{ retry: [] }>();
</script>
