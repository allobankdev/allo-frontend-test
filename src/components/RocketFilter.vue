<template>
  <v-text-field
    v-model="localQuery"
    label="Search rockets..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    clearable
    hide-details
    density="comfortable"
    class="filter-input"
    @update:model-value="handleInput"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRocketStore } from '@/stores/rocket'

const rocketStore = useRocketStore()
const localQuery = ref(rocketStore.filterQuery)

watch(() => rocketStore.filterQuery, (newValue) => {
  localQuery.value = newValue
})

function handleInput(value: string | null) {
  rocketStore.setFilterQuery(value || '')
}
</script>

<style scoped>
.filter-input {
  max-width: 400px;
}

.filter-input :deep(.v-field) {
  border-radius: 8px;
}
</style>

