<template>
  <div class="error-state" role="alert" aria-live="assertive">
    <p class="error-state__title">
      {{ title }}
    </p>
    <p class="error-state__message">
      {{ message }}
    </p>
    <BaseButton
      id="error-retry-btn"
      type="button"
      variant="secondary"
      :loading="retrying"
      @click="$emit('retry')"
    >
      Try Again
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  message?: string
  retrying?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.error-state__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--error);
  margin: 0;
}

.error-state__message {
  font-size: 0.875rem;
  color: var(--text-muted);
  max-width: 420px;
  margin: 0;
}
</style>
