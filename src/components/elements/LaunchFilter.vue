<script setup lang="ts">

import { ref } from 'vue'
const isOpen = ref(false)

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'apply', filters: { from?: Date; to?: Date; status: string }): void
}>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const applyFilters = (filters: { from?: Date; to?: Date; status: string }) => {
  emit('apply', filters)
  isOpen.value = false
}
</script>

<template>
  <div class="filter-box">
    <input
        type="text"
        placeholder="Search by name..."
        class="search-input"
        :value="props.modelValue"
        @input="onInput"
    />

    <button @click="isOpen = !isOpen">
        Filter
    </button>

    <FilterDropdown 
        v-if="isOpen" 
        @apply="applyFilters"
        @close="isOpen = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.filter-box {
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 16px;
  gap: 10px; 
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: dimgray;
  color: white;
}

button:hover {
  background-color: gray;
  transform: scale(1.05);
}
</style>
