<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
})
</script>

<template>
  <div class="d-flex align-start py-2">
    <v-icon :icon="icon" size="20" class="mr-3 mt-1" color="primary" />
    <div>
      <div class="text-caption text-medium-emphasis">{{ label }}</div>
      <div class="text-body-1">{{ value }}</div>
    </div>
  </div>
</template>
