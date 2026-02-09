<template>
  <v-card class="mb-4" elevation="1">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localSearchQuery"
            label="Search rockets..."
            prepend-inner-icon="mdi-magnify"
            clearable
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="handleSearchChange"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="localFilterActive"
            :items="filterOptions"
            label="Filter by status"
            prepend-inner-icon="mdi-filter-variant"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  searchQuery: string
  filterActive: boolean | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterActive': [value: boolean | null]
}>()

const localSearchQuery = ref(props.searchQuery)
const localFilterActive = ref(props.filterActive)

const filterOptions = [
  { title: 'All Rockets', value: null },
  { title: 'Active Only', value: true },
  { title: 'Inactive Only', value: false },
]

watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal
})

watch(() => props.filterActive, (newVal) => {
  localFilterActive.value = newVal
})

function handleSearchChange(value: string | null) {
  emit('update:searchQuery', value || '')
}

function handleFilterChange(value: boolean | null) {
  emit('update:filterActive', value)
}
</script>
