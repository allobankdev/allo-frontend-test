<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'


import LoadingState
  from '@/components/common/LoadingState.vue'

import ErrorState
  from '@/components/common/ErrorState.vue'

import EmptyState
  from '@/components/common/EmptyState.vue'

import RocketFilter
  from '@/components/rocket/RocketFilter.vue'

import RocketGrid
  from '@/components/rocket/RocketGrid.vue'

import AddRocketModal
  from '@/components/rocket/AddRocketModal.vue'

import {
  filterRockets,
} from'@/utils/rocketFilter'

import type {
  RocketFilters,
 } from '@/types/rocketFilter'

import {
  useRocketStore,
} from '@/stores/rocketStore'


import type {
  NewRocketInput,
} from '@/types/rocket'


const {
  state,
  rockets,
  loadRockets,
  addRocket,
} = useRocketStore()


const filters =
  ref<RocketFilters>({
    search: '',
    launchCost: 'all',
    firstFlight: 'all',
  })

const modalOpen =
  ref(false)


const filteredRockets =
  computed(() => {
    return filterRockets(
      rockets.value,
      filters.value,
    )
  })

function handleAddRocket(
  rocket: NewRocketInput,
) {
  addRocket(rocket)
}

onMounted(() => {
  loadRockets()
})
</script>

<template>
  <main class="page">

    <header class="page-header">

      <div>

        <img
          src="/logo.svg" alt="SpaceX"
        >
        <p>
          Browse available SpaceX
          launch vehicles.
        </p>

      </div>


      <button
        class="add-button"

        type="button"

        @click="
          modalOpen = true
        "
      >
        + Add Rocket
      </button>

    </header>


    <section class="toolbar">

      <RocketFilter
        v-model="filters"
      />

    </section>


    <LoadingState
      v-if="state.loading"
    />


    <ErrorState
      v-else-if="state.error"

      :message="state.error"

      @retry="
        loadRockets(true)
      "
    />


    <template v-else>

      <div class="result-info">

        {{
          filteredRockets.length
        }}
        rocket(s)

      </div>


      <EmptyState
        v-if="
          filteredRockets.length === 0
        "
      />


      <RocketGrid
        v-else

        :rockets="
          filteredRockets
        "
      />

    </template>


    <AddRocketModal
      :open="modalOpen"

      @close="
        modalOpen = false
      "

      @add="
        handleAddRocket
      "
    />

  </main>
</template>

<style scoped
  src="@/pages/index.css"
></style>
