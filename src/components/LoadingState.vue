<template>
  <div
    class="d-flex flex-column align-center justify-center text-center py-16"
    role="status"
    aria-live="polite"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="44"
      width="4"
    />
    <p class="text-body-2 text-medium-emphasis mt-4">
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
