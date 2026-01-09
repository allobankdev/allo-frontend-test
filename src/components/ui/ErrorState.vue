<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h2>Oops! Something went wrong</h2>
    <p v-if="message">{{ message }}</p>
    <BaseButton @click="handleRetry">Retry</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@/components/base/BaseButton.vue'

defineProps({
  message: {
    type: String,
    default: 'Failed to load data. Please try again.'
  }
})

const emit = defineEmits(['retry'])

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 20px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
}

.error-state h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.error-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
  max-width: 400px;
}
</style>
