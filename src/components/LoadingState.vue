<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-progress-circular color="primary" indeterminate size="48" />
    <p class="mt-4 text-body-2 text-medium-emphasis">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ message?: string }>(), {
    message: 'Loading rockets...',
  })
</script>