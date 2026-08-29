<template>
  <div class="loading-container">
    <v-progress-circular
      :size="size"
      :width="width"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <p v-if="message" class="loading-message mt-4">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  size?: number
  width?: number
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  size: 70,
  width: 7,
})
</script>
