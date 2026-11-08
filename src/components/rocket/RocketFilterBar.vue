<script setup lang="ts">
/**
 * Search, status, reusable, and sort controls. Two-way bound with `v-model:filters`.
 * The search box is debounced so the URL is not rewritten on every keystroke.
 */
import { onBeforeUnmount, ref, watch } from 'vue'
import { SORT_OPTIONS, type RocketFilters, type SortKey, type StatusFilter } from '@/utils/rocket-filters'

const SEARCH_DEBOUNCE_MS = 250

defineProps<{
  resultCount: number
  totalCount: number
  isFiltered: boolean
}>()

const emit = defineEmits<{
  reset: []
}>()

const filters = defineModel<RocketFilters>('filters', { required: true })

function update (patch: Partial<RocketFilters>): void {
  filters.value = { ...filters.value, ...patch }
}

// ── Debounced search ──
const searchText = ref(filters.value.query)
let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(() => filters.value.query, query => {
  if (query !== searchText.value.trim()) searchText.value = query
})

function onSearchInput (value: string | null): void {
  searchText.value = value ?? ''
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => update({ query: searchText.value }), SEARCH_DEBOUNCE_MS)
}

onBeforeUnmount(() => clearTimeout(searchTimer))
</script>

<template>
  <v-sheet
    class="pa-4"
    color="surface"
    rounded="lg"
    border
  >
    <v-row
      dense
      align="center"
    >
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          :model-value="searchText"
          label="Search rockets"
          placeholder="Name, family, or description"
          prepend-inner-icon="mdi-magnify"
          type="search"
          clearable
          hide-details
          @update:model-value="onSearchInput"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-btn-toggle
          :model-value="filters.status"
          aria-label="Filter by status"
          class="w-100"
          color="primary"
          density="comfortable"
          mandatory
          variant="outlined"
          divided
          @update:model-value="(status: StatusFilter) => update({ status })"
        >
          <v-btn
            value="all"
            class="flex-grow-1"
          >
            All
          </v-btn>
          <v-btn
            value="active"
            class="flex-grow-1"
          >
            Active
          </v-btn>
          <v-btn
            value="retired"
            class="flex-grow-1"
          >
            Retired
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          :model-value="filters.sort"
          :items="SORT_OPTIONS"
          label="Sort by"
          prepend-inner-icon="mdi-sort"
          hide-details
          @update:model-value="(sort: SortKey) => update({ sort })"
        />
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mt-3">
      <v-switch
        :model-value="filters.reusableOnly"
        label="Reusable only"
        density="compact"
        @update:model-value="(value: boolean | null) => update({ reusableOnly: Boolean(value) })"
      />

      <div class="d-flex align-center ga-2">
        <span
          class="text-body-2 text-medium-emphasis"
          aria-live="polite"
        >
          Showing <strong class="text-high-emphasis">{{ resultCount }}</strong> of {{ totalCount }} rockets
        </span>
        <v-btn
          v-if="isFiltered"
          prepend-icon="mdi-filter-remove-outline"
          size="small"
          variant="text"
          @click="emit('reset')"
        >
          Clear filters
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>
