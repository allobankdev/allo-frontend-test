<template>
  <div
    class="d-flex align-center justify-center bg-blue-grey-darken-4"
    :style="{ height: `${height}px` }"
  >
    <v-icon
      icon="mdi-rocket-outline"
      size="52"
      color="blue-grey-lighten-2"
    />
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ height?: number }>(), { height: 260 })
</script>
