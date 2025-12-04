<template>
  <div class="loading-indicator">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
    <p class="mt-4 text-center">Loading...</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}
</style>