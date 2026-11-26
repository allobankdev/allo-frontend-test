<script setup lang="ts">
  defineProps<{ size: number }>()
</script>

<template>
  <div class="d-flex align-center justify-center fill-height bg-blue-darken-4">
    <v-icon
      icon="mdi-rocket-launch-outline"
      :size="size"
    />
  </div>
</template>
