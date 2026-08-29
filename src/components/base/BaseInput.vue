<template>
  <div class="base-input">
    <label v-if="label" :for="inputId">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      :value="displayValue"
      :placeholder="placeholder"
      rows="4"
      @input="handleInput"
    />
    <input
      v-else
      :id="inputId"
      :type="type"
      :value="displayValue"
      :placeholder="placeholder"
      @input="handleInput"
      @keyup.enter="handleEnter"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'enter'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Convert modelValue to string for display
const displayValue = computed(() => {
  return props.modelValue === null || props.modelValue === undefined
    ? ''
    : String(props.modelValue)
})

const handleInput = (event) => {
  const value = event.target.value

  // Convert to number if input type is number
  if (props.type === 'number' && value !== '') {
    emit('update:modelValue', Number(value))
  } else {
    emit('update:modelValue', value)
  }
}

const handleEnter = () => {
  emit('enter')
}
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.base-input label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.base-input input,
.base-input textarea {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: inherit;
}

.base-input textarea {
  resize: vertical;
  min-height: 80px;
}

.base-input input::placeholder,
.base-input textarea::placeholder {
  color: #999999;
  opacity: 1;
}

.base-input input:focus,
.base-input textarea:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}
</style>
