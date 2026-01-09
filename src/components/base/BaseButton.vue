<template>
  <button
    :class="['base-button', variant]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>
.base-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button.primary {
  background-color: #42b883;
  color: white;
}

.base-button.primary:hover:not(:disabled) {
  background-color: #33a06f;
}

.base-button.secondary {
  background-color: #6c757d;
  color: white;
}

.base-button.secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.base-button.danger {
  background-color: #dc3545;
  color: white;
}

.base-button.danger:hover:not(:disabled) {
  background-color: #c82333;
}
</style>
