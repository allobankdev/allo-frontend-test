<template>
  <div
    class="d-flex flex-column align-center justify-center py-12"
    role="status"
    aria-live="polite"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
      width="6"
      class="mb-4"
    />
    <p class="text-h6 font-weight-medium text-high-emphasis mb-1">
      {{ title }}
    </p>
    <p class="text-body-2 text-medium-emphasis">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Loading Rockets...',
  message: 'Fetching the latest SpaceX launcher data from Launch Library API',
})
</script>
