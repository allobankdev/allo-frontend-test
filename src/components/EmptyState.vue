<template>
  <div class="empty-state" role="status" aria-live="polite">
    <p class="empty-state__title">
      {{ title }}
    </p>
    <p class="empty-state__message">
      {{ message }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'No rockets found',
    message: 'Try adjusting your search or filter criteria.',
  },
)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.5rem;
}

.empty-state__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.empty-state__message {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 380px;
}
</style>
