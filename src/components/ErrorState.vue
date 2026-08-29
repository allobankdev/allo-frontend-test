<script setup lang="ts">
defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="error-container">
    <p class="error-text">
      {{ message ?? 'Something went wrong. Please try again.' }}
    </p>

    <button @click="emit('retry')">
      Retry
    </button>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.error-text {
  color: #d32f2f;
  margin-bottom: 12px;
}

button {
  padding: 8px 16px;
  border: none;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  opacity: 0.9;
}
</style>
