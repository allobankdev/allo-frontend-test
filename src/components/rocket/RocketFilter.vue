<script setup lang="ts">
import {
  computed,
} from 'vue'

import type {
  FirstFlightFilter,
  LaunchCostFilter,
  RocketFilters,
} from '@/types/rocketFilter'


const props =
  defineProps<{
  modelValue: RocketFilters
}>()

const emit = defineEmits<{
  (
    event: 'update:modelValue',
    value: RocketFilters,
  ): void
}>()

const hasActiveFilters =
  computed(() => {

    return (
      props.modelValue.search
        !== ''
      ||
      props.modelValue.launchCost
        !== 'all'
      ||
      props.modelValue.firstFlight
        !== 'all'
    )

  })
function updateSearch(
  event: Event,
) {

  const input =
    event.target as HTMLInputElement


  emit(
    'update:modelValue',
    {
      ...props.modelValue,

      search:
        input.value,
    },
  )
}


function updateLaunchCost(
  event: Event,
) {

  const select =
    event.target as HTMLSelectElement


  emit(
    'update:modelValue',
    {
      ...props.modelValue,

      launchCost:
        select.value as LaunchCostFilter,
    },
  )
}


function updateFirstFlight(
  event: Event,
) {

  const select =
    event.target as HTMLSelectElement


  emit(
    'update:modelValue',
    {
      ...props.modelValue,

      firstFlight:
        select.value as FirstFlightFilter,
    },
  )
}


function resetFilters() {

  emit(
    'update:modelValue',
    {
      search: '',

      launchCost:
        'all',

      firstFlight:
        'all',
    },
  )

}
</script>


<template>
   <div class="rocket-filter">

    <!-- SEARCH -->

    <div class="filter-group search-group">

      <label for="rocket-search">
        Search
      </label>


      <input
        id="rocket-search"

        type="search"

        :value="
          modelValue.search
        "

        placeholder="Search rocket..."

        @input="
          updateSearch
        "
      >

    </div>


    <div class="filter-group">

      <label for="launch-cost">
        Launch Cost
      </label>


      <select
        id="launch-cost"

        :value="
          modelValue.launchCost
        "

        @change="
          updateLaunchCost
        "
      >

        <option value="all">
          All Costs
        </option>

        <option value="under-20">
          Under $20M
        </option>

        <option value="20-50">
          $20M - $50M
        </option>

        <option value="50-100">
          $50M - $100M
        </option>

        <option value="over-100">
          Above $100M
        </option>

        <option value="unknown">
          Unknown Cost
        </option>

      </select>

    </div>

    <div class="filter-group">

      <label for="first-flight">
        First Flight
      </label>


      <select
        id="first-flight"

        :value="
          modelValue.firstFlight
        "

        @change="
          updateFirstFlight
        "
      >

        <option value="all">
          All Years
        </option>

        <option value="before-2010">
          Before 2010
        </option>

        <option value="2010-2019">
          2010 - 2019
        </option>

        <option value="2020-plus">
          2020 and Later
        </option>

        <option value="unknown">
          Unknown
        </option>

      </select>

    </div>

    <button
      class="reset-button"

      type="button"

      :disabled="
        !hasActiveFilters
      "

      @click="
        resetFilters
      "
    >
      Reset
    </button>

  </div>
</template>

<style scoped
  src="@/components/rocket/style/rocketfilter.css"
></style>
