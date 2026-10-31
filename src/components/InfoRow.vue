<template>
  <div class="py-2">
    <div class="text-caption text-medium-emphasis">
      {{ label }}
    </div>
    <div class="text-body-1 font-weight-medium">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ label: string, value: string }>()
</script>

