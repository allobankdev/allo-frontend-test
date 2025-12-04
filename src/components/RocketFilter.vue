<template>
  <div class="rocket-filter">
    <v-text-field
      v-model="filterText"
      prepend-inner-icon="mdi-magnify"
      @input="debouncedHandleFilterChange"
      label="Filter rockets"
      variant="outlined"
      hide-details
      single-line
      placeholder="Search by name, description or country"
    />
  </div>
</template>

<script setup lang="ts">
import { useRocketsStore } from '@/stores/rockets';
import { ref, watch } from 'vue';
const rocketStore = useRocketsStore();
const filterText = ref(rocketStore.filter);
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      fn.apply(this, args);
      timeout = null;
    }, wait);
  };
}
const handleFilterChange = () => {
  rocketStore.setFilter(filterText.value);
};
const debouncedHandleFilterChange = debounce(handleFilterChange, 300);
watch(() => filterText.value, (newFilter) => {
  filterText.value = newFilter;
});
</script>

<style scoped>
.rocket-filter {
  max-width: 500px;
  width: 100%;
  margin-bottom: 16px;
}
</style>