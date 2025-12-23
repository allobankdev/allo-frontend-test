<template>
  <v-text-field
    v-model="localQuery"
    label="Filter rockets"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    clearable
    hide-details
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

