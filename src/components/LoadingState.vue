<template>
  <div class="d-flex flex-column align-center justify-center text-medium-emphasis py-16" role="status">
    <v-progress-circular indeterminate color="primary" size="40" class="mb-4" />
    <span>{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Loading rockets…',
})
</script>
