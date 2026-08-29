<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p>{{ message || 'Loading data, please wait...' }}</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #ddd;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
