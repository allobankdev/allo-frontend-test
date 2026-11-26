<template>
  <div class="state-panel d-flex flex-column align-center justify-center text-center pa-10">
    <v-progress-circular indeterminate color="primary" size="56" width="5" />
    <p class="text-body-1 mt-4 mb-0">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  },
)
</script>
