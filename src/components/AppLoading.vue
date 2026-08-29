<template>
  <div class="loading-container">
    // eslint-disable-next-line vue/html-self-closing
    <div class="spinner"></div>
    <p>Loading rockets...</p>
  </div>
</template>

<script setup lang="ts">
// TypeScript component without props
</script>

<style scoped>
/* CSS sama seperti sebelumnya */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>