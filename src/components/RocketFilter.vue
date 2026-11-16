<template>
  <v-card
    class="pa-4 rounded-xl mb-6"
    elevation="1"
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
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search rocket by name, country, or keyword..."
          density="comfortable"
          variant="outlined"
          hide-details
          clearable
          @click:clear="onClearSearch"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-btn-toggle
          v-model="activeFilter"
          mandatory
          divided
          variant="outlined"
          density="comfortable"
          color="primary"
          class="w-100 d-flex"
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
          v-model="sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-sort"
          hide-details
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import type { ActiveFilter, SortOption } from '@/stores/rockets'

const store = useRocketStore()

const search = computed({
  get: () => store.searchQuery,
  set: (val: string | null) => store.setSearchQuery(val || ''),
})

const activeFilter = computed<ActiveFilter>({
  get: () => store.filterActive,
  set: (val: ActiveFilter) => store.setFilterActive(val),
})

const sortBy = computed<SortOption>({
  get: () => store.sortBy,
  set: (val: SortOption) => store.setSortBy(val),
})

const onClearSearch = () => {
  store.setSearchQuery('')
}

const sortOptions = [
  { title: 'First Flight (Newest)', value: 'flight-desc' },
  { title: 'Name (A - Z)', value: 'name-asc' },
  { title: 'Name (Z - A)', value: 'name-desc' },
  { title: 'Launch Cost (High - Low)', value: 'cost-desc' },
  { title: 'Launch Cost (Low - High)', value: 'cost-asc' },
]
</script>
