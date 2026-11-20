<template>
  <section class="error-panel">
    <p class="u-label">
      Request failed / LL2
    </p>
    <h2>Unable to load launch data.</h2>
    <p class="error-panel__body">
      {{ message || 'An error occurred while communicating with the Launch Library API.' }}
    </p>
    <v-btn
      color="primary"
      variant="outlined"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry request
    </v-btn>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped>
.error-panel {
  max-width: 640px;
  padding: clamp(28px, 5vw, 48px) 0;
  border-top: 1px solid var(--fleet-hairline);
}

.error-panel h2 {
  margin: 12px 0 10px;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.error-panel__body {
  margin: 0 0 24px;
  max-width: 56ch;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.65);
}
</style>
