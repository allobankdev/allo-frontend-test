<template>
  <div class="filter-container">
    <input
      type="text"
      v-model="localFilter"
      placeholder="Search rockets by name or description..."
      class="filter-input"
      @input="handleInput"
    />
    <div class="filter-icon">🔍</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRocketStore } from '../store';

const rocketStore = useRocketStore();
const localFilter = ref<string>(rocketStore.filterText);

const handleInput = (): void => {
  rocketStore.setFilter(localFilter.value);
};
</script>

<style scoped>
.filter-container {
  position: relative;
  margin-bottom: 30px;
}

.filter-input {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.filter-input:focus {
  outline: none;
  border-color: #2196f3;
}

.filter-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
}
</style>