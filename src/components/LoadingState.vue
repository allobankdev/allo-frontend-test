<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-progress-circular color="primary" indeterminate size="40" width="2" />
    <p class="eyebrow mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ message?: string }>(), {
    message: 'Loading rockets...',
  })
</script>