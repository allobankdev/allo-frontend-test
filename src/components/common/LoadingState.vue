<template>
  <div
    aria-live="polite"
    class="state"
    role="status"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="text-medium-emphasis mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    message?: string
  }>(), {
    message: 'Loading…',
  })
</script>

<style scoped>
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 16px;
    text-align: center;
  }
</style>
