<template>
  <div class="d-flex flex-column align-center justify-center py-12">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
      width="6"
    />
    <p class="mt-4 text-subtitle-1 text-medium-emphasis">
      {{ message || 'Loading rocket data...' }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>
