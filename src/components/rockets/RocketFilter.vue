<template>
  <div class="rocket-filter">
    <BaseInput
      v-model="filterValue"
      label="Filter Rockets"
      type="text"
      placeholder="Search by name or country..."
      @enter="handleFilter"
    />
    <BaseButton variant="primary" @click="handleFilter">Filter</BaseButton>
    <BaseButton
      v-if="filterValue"
      variant="secondary"
      @click="handleClear"
    >
      Clear
    </BaseButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const emit = defineEmits(['filter'])

const filterValue = ref('')

const handleFilter = () => {
  emit('filter', filterValue.value)
}

const handleClear = () => {
  filterValue.value = ''
  emit('filter', '')
}
</script>

<style scoped>
.rocket-filter {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.rocket-filter > * {
  flex: 1;
  min-width: 150px;
}

.rocket-filter .base-input {
  flex: 2;
  min-width: 250px;
}
</style>
