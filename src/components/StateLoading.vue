<template>
  <div class="d-flex flex-column align-center justify-center py-16 text-center">
    <v-progress-circular
      class="mb-4"
      color="primary"
      indeterminate
      size="48"
      width="4"
    />
    <p class="text-body-1 text-medium-emphasis">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    message?: string
  }

  withDefaults(defineProps<Props>(), {
    message: 'Loading rockets...',
  })
</script>