<template>
  <div class="d-flex justify-center align-center" style="min-height: 400px;">
    <div class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <div class="mt-4 text-h6">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Loading...',
})
</script>

