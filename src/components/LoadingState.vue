<template>
  <div
    aria-live="polite"
    class="state d-flex flex-column align-center justify-center text-center pa-8"
    role="status"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="text-body-1 text-medium-emphasis mt-4">
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
  min-height: 240px;
}
</style>
