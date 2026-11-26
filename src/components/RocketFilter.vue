<template>
  <v-card class="filter-card" variant="flat">
    <v-card-text class="pa-4">
      <v-row dense align="center">
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="search"
            label="Search rockets"
            placeholder="Name, description, or country"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @update:model-value="onSearch"
          />
        </v-col>

        <v-col cols="12" sm="8" md="4">
          <v-select
            :model-value="country"
            :items="countryItems"
            label="Country"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="onCountry"
          />
        </v-col>

        <v-col cols="12" sm="4" md="2" class="d-flex justify-end">
          <v-btn
            variant="text"
            prepend-icon="mdi-filter-remove-outline"
            :disabled="!isFiltered"
            @click="emit('reset')"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>

      <div class="d-flex flex-wrap align-center ga-2 mt-3 text-body-2 text-medium-emphasis">
        <span>Showing {{ resultCount }} of {{ totalCount }} rockets</span>
        <v-chip v-if="isFiltered" size="small" variant="tonal" color="primary">
          Filters active
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  search: string
  country: string
  countries: string[]
  resultCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:country': [value: string]
  reset: []
}>()

const countryItems = computed(() => [
  { title: 'All countries', value: 'all' },
  ...props.countries.map(code => ({ title: code, value: code })),
])

const isFiltered = computed(() => Boolean(props.search.trim()) || props.country !== 'all')

function onSearch(value: string | null) {
  emit('update:search', value ?? '')
}

function onCountry(value: string | null) {
  emit('update:country', value ?? 'all')
}
</script>

<style scoped>
.filter-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
