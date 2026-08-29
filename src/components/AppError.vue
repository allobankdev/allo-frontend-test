<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="error-container">
    <div class="error-icon"></div>
    <h3>Something went wrong</h3>
    <p>{{ message }}</p>
    // eslint-disable-next-line vue/max-attributes-per-line
    <button @click="onRetry" class="retry-button">
      Try Again
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  onRetry: () => void;
}

defineProps<Props>();
</script>

<style scoped>
/* CSS sama seperti sebelumnya */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  border: 1px solid #f8d7da;
  background-color: #f8d7da;
  border-radius: 8px;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 16px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #c82333;
}
</style>