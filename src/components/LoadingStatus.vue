<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
    <div class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey-darken-1">
        {{ message || 'Loading...' }}
      </p>
    </div>
</template>
