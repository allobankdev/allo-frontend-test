<template>
  <div class="d-flex justify-space-between align-center py-3 ga-4">
    <span class="text-medium-emphasis">{{ label }}</span>
    <span class="font-weight-medium text-right">{{ value }}</span>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ label: string, value: string }>()
</script>