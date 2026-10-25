<template>
  <div class="loading-state">

    <div class="spinner"></div>

    <p>
      Loading rockets...
    </p>

  </div>
</template>


<style scoped>
.loading-state {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;

  color: #dcdbdb;
}

.spinner {
  width: 36px;
  height: 36px;

  border: 3px solid #ddd;
  border-top-color: #111;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}
</style>