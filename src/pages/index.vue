<script setup lang="ts">
/**
 * Rocket list screen.
 * Lifecycle: fetch on mount (cached in the store), abort the request on unmount.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketsStore } from '@/stores/rockets'
import { useRocketFilters } from '@/composables/useRocketFilters'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import type { NewRocketInput, Rocket } from '@/types/rocket'
import RocketFilterBar from '@/components/rocket/RocketFilterBar.vue'
import RocketFormDialog from '@/components/rocket/RocketFormDialog.vue'
import RocketGrid from '@/components/rocket/RocketGrid.vue'
import EmptyState from '@/components/state/EmptyState.vue'
import ErrorState from '@/components/state/ErrorState.vue'
import LoadingState from '@/components/state/LoadingState.vue'

useDocumentTitle('SpaceX rockets')

const store = useRocketsStore()
const { allRockets, listStatus, listError } = storeToRefs(store)
const { filters, filteredRockets, isFiltered, resetFilters } = useRocketFilters(allRockets)

// ── Data loading ──
let controller: AbortController | null = null

function loadRockets (force = false): void {
  controller?.abort()
  controller = new AbortController()
  store.fetchRockets({ force, signal: controller.signal })
}

onMounted(() => loadRockets())
onBeforeUnmount(() => controller?.abort())

// ── Add rocket ──
const isFormOpen = ref(false)
const lastAdded = ref<Rocket | null>(null)
const showAddedToast = ref(false)

function onAddRocket (input: NewRocketInput): void {
  lastAdded.value = store.addRocket(input)
  isFormOpen.value = false
  showAddedToast.value = true
}
</script>

<template>
  <div>
    <header class="d-flex flex-column flex-sm-row align-sm-end justify-space-between ga-4 mb-6">
      <div>
        <p class="text-overline text-primary mb-1">
          Launch Library 2
        </p>
        <h1 class="text-h4 text-md-h3 font-weight-bold">
          SpaceX rockets
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Every launch vehicle SpaceX has built, from Falcon 1 to Starship.
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        @click="isFormOpen = true"
      >
        Add rocket
      </v-btn>
    </header>

    <LoadingState v-if="listStatus === 'loading' || listStatus === 'idle'" />

    <ErrorState
      v-else-if="listStatus === 'error'"
      title="Couldn't load rockets"
      :message="listError ?? 'Please try again.'"
      @retry="loadRockets(true)"
    />

    <template v-else>
      <RocketFilterBar
        v-model:filters="filters"
        class="mb-6"
        :is-filtered="isFiltered"
        :result-count="filteredRockets.length"
        :total-count="allRockets.length"
        @reset="resetFilters"
      />

      <RocketGrid
        v-if="filteredRockets.length"
        :rockets="filteredRockets"
      />

      <EmptyState
        v-else
        icon="mdi-magnify-close"
        title="No rockets match your filters"
        message="Try a different search term or clear the filters."
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-filter-remove-outline"
          variant="tonal"
          @click="resetFilters"
        >
          Clear filters
        </v-btn>
      </EmptyState>
    </template>

    <RocketFormDialog
      v-model="isFormOpen"
      @submit="onAddRocket"
    />

    <v-snackbar
      v-model="showAddedToast"
      color="surface-bright"
      location="bottom"
      timeout="5000"
    >
      <v-icon
        class="mr-2"
        color="success"
        icon="mdi-check-circle"
      />
      “{{ lastAdded?.name }}” was added.
      <template #actions>
        <v-btn
          v-if="lastAdded"
          :to="{ name: '/rockets/[id]', params: { id: lastAdded.id } }"
          color="primary"
          variant="text"
        >
          View
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
