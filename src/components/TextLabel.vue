<template>
  <div>
    <div class="text-caption text-medium-emphasis mb-1">
      {{ label }}
    </div>
    <div class="text-body-2 font-weight-medium">
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{label?: string, value?: string}>()
</script>
