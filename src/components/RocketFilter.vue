<template>
  <div class="rocket-filter">
    <div class="d-flex flex-column flex-sm-row ga-3 rocket-filter__search">
      <v-text-field
        class="flex-grow-1"
        clearable
        density="comfortable"
        hide-details
        label="Filter rockets"
        :model-value="store.filterQuery"
        placeholder="Search by name or description"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="value => store.setFilterQuery(value ?? '')"
      />
      <slot name="actions" />
    </div>

    <div class="d-flex flex-wrap ga-3 mt-3">
      <v-select
        v-model="store.countryFilter"
        class="rocket-filter__select"
        clearable
        density="comfortable"
        hide-details
        :items="countries"
        label="Country"
        placeholder="All countries"
        variant="outlined"
      />
      <v-select
        v-model="store.flightStatusFilter"
        class="rocket-filter__select"
        density="comfortable"
        hide-details
        :items="FLIGHT_STATUS_OPTIONS"
        label="Flight status"
        variant="outlined"
      />
      <v-select
        v-model="store.costStatusFilter"
        class="rocket-filter__select"
        density="comfortable"
        hide-details
        :items="COST_STATUS_OPTIONS"
        label="Launch cost"
        variant="outlined"
      />
    </div>

    <div class="d-flex align-center flex-wrap ga-2 mt-3">
      <span class="text-body-2 text-medium-emphasis">
        {{ resultLabel }}
      </span>
      <v-btn
        v-if="store.hasFilter"
        density="comfortable"
        prepend-icon="mdi-filter-remove-outline"
        size="small"
        variant="text"
        @click="store.clearFilter"
      >
        Reset filters
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{
    /** Rockets fetched from the API, used to build the country options. */
    source: Rocket[] | undefined
    /** How many rockets survive the current filters. */
    resultCount: number
  }>()

  const FLIGHT_STATUS_OPTIONS = [
    { title: 'All rockets', value: 'all' },
    { title: 'Has flown', value: 'flown' },
    { title: 'Never flown', value: 'not_flown' },
  ]

  const COST_STATUS_OPTIONS = [
    { title: 'Any cost', value: 'all' },
    { title: 'Cost published', value: 'has_cost' },
    { title: 'Cost unavailable', value: 'no_cost' },
  ]

  const store = useRocketsStore()

  const countries = computed(() => store.availableCountries(props.source))

  const resultLabel = computed(() => {
    const count = props.resultCount
    const noun = count === 1 ? 'rocket' : 'rockets'
    return store.hasFilter ? `${count} ${noun} match your filters` : `${count} ${noun}`
  })
</script>

<style scoped>
  /* The comfortable-density text field is 48px tall while a default v-btn is
     36px, so match any action passed into the slot to the field's height. */
  .rocket-filter__search :deep(.v-btn) {
    height: 48px;
  }

  .rocket-filter__select {
    min-width: 12rem;
    flex: 1 1 12rem;
  }
</style>
