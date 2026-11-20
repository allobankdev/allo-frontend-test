<template>
  <v-sheet
    rounded="xl"
    color="surface"
    class="filter-panel pa-4 mb-6"
  >
    <v-row
      align="center"
      dense
    >
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          :model-value="localSearch"
          :loading="isPending"
          placeholder="Search rockets by name, description, or country..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          @update:model-value="localSearch = $event ?? ''"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          :model-value="countryFilter"
          :items="countryItems"
          label="Country"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="$emit('update:countryFilter', $event ?? ALL_COUNTRIES)"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          :model-value="sortBy"
          :items="sortItems"
          label="Sort by"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="$emit('update:sortBy', $event ?? 'default')"
        />
      </v-col>
    </v-row>

    <div
      class="filter-status-row d-flex align-center justify-space-between mt-3 text-body-2 text-medium-emphasis"
    >
      <span>{{ showCount ? countLabel : 'Loading rockets...' }}</span>

      <v-btn
        v-if="hasActiveFilters"
        variant="text"
        size="small"
        height="28"
        color="primary"
        class="text-none px-2"
        @click="$emit('reset')"
      >
        Reset filters
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebouncedRef } from '@/composables/useDebounce'
import { ALL_COUNTRIES, SEARCH_DEBOUNCE_MS } from '@/constants/app'
import type { RocketSortOption } from '@/types/rocket'

const props = defineProps<{
  searchQuery: string
  countryFilter: string
  sortBy: RocketSortOption
  countries: string[]
  totalCount: number
  filteredCount: number
  hasActiveFilters: boolean
  showCount: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:countryFilter': [value: string]
  'update:sortBy': [value: RocketSortOption]
  reset: []
}>()

const localSearch = ref(props.searchQuery)
const { debouncedValue, isPending } = useDebouncedRef(localSearch, SEARCH_DEBOUNCE_MS)

watch(
  () => props.searchQuery,
  (next) => {
    if (next !== localSearch.value) {
      localSearch.value = next
    }
  },
)

watch(debouncedValue, (next) => {
  if (next !== props.searchQuery) {
    emit('update:searchQuery', next)
  }
})

const countryItems = computed(() => [
  { title: 'All countries', value: ALL_COUNTRIES },
  ...props.countries.map(code => ({ title: code, value: code })),
])

const sortItems: Array<{ title: string, value: RocketSortOption }> = [
  { title: 'Default order', value: 'default' },
  { title: 'Name (A–Z)', value: 'name-asc' },
  { title: 'First flight (Newest)', value: 'first-flight-desc' },
  { title: 'Launch cost (Low–High)', value: 'cost-asc' },
]

const countLabel = computed(() => {
  const unit = props.totalCount === 1 ? 'rocket' : 'rockets'
  if (props.filteredCount !== props.totalCount) {
    return `Showing ${props.filteredCount} of ${props.totalCount} ${unit}`
  }
  return `${props.totalCount} ${unit}`
})
</script>

<style scoped>
.filter-panel {
  border: 1px solid var(--app-border);
}

.filter-status-row {
  min-height: 28px;
}
</style>
