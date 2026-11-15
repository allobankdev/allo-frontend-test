<template>
  <section class="flex flex-col gap-8">
    <header class="flex flex-col gap-6 border-b border-space-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl">
        <p class="eyebrow">
          SpaceX · Vehicle catalog
        </p>
        <h1 class="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-wide text-white sm:text-6xl">
          Launch vehicles
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
          Every SpaceX launch vehicle configuration on record, from Falcon 1 to Starship.
          Open a vehicle for its full datasheet, or add your own entry.
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-end">
        <dl
          v-if="listStatus === 'success'"
          class="flex gap-6 font-mono"
        >
          <div
            v-for="stat in summary"
            :key="stat.label"
          >
            <dt class="data-label">
              {{ stat.label }}
            </dt>
            <dd class="mt-1 text-2xl text-white">
              {{ stat.value }}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          class="btn-primary self-start sm:self-auto"
          @click="isAddDialogOpen = true"
        >
          <span
            class="mdi mdi-plus"
            aria-hidden="true"
          />
          Add rocket
        </button>
      </div>
    </header>

    <RocketFilter
      :filters="filters"
      :countries="countries"
      :has-active-filters="hasActiveFilters"
      @change="store.setFilters"
      @reset="store.resetFilters"
    />

    <LoadingState
      v-if="isLoading"
      label="Retrieving vehicle data"
    />

    <ErrorState
      v-else-if="listStatus === 'error'"
      title="Couldn't load rockets"
      :message="listError"
      @retry="retry"
    />

    <template v-else>
      <p
        class="-mt-4 font-mono text-xs uppercase tracking-wider text-slate-500"
        aria-live="polite"
      >
        Showing <span class="text-slate-200">{{ pad(filteredRockets.length) }}</span> of {{ pad(rockets.length) }} vehicles
      </p>

      <EmptyState
        v-if="filteredRockets.length === 0"
        :code="hasActiveFilters ? '0 results' : 'Empty registry'"
        :title="hasActiveFilters ? 'No matching vehicles' : 'No rockets available'"
        :description="hasActiveFilters ? 'Try a different search term or reset the filters.' : 'Add a rocket to get started.'"
      >
        <button
          v-if="hasActiveFilters"
          type="button"
          class="btn-secondary"
          @click="store.resetFilters"
        >
          Reset filters
        </button>
        <button
          v-else
          type="button"
          class="btn-primary"
          @click="isAddDialogOpen = true"
        >
          Add rocket
        </button>
      </EmptyState>

      <ul
        v-else
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="rocket in filteredRockets"
          :key="rocket.id"
        >
          <RocketCard :rocket="rocket" />
        </li>
      </ul>
    </template>

    <AddRocketDialog
      v-model:open="isAddDialogOpen"
      @created="onRocketCreated"
    />
  </section>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rockets'

  const store = useRocketStore()
  const { rockets, filteredRockets, filters, countries, hasActiveFilters, listStatus, listError } = storeToRefs(store)

  const isAddDialogOpen = ref(false)
  const isLoading = computed(() => listStatus.value === 'idle' || listStatus.value === 'loading')

  const pad = (value: number): string => String(value).padStart(2, '0')

  const summary = computed(() => [
    { label: 'Vehicles', value: pad(rockets.value.length) },
    { label: 'Active', value: pad(rockets.value.filter(rocket => rocket.active === true).length) },
    { label: 'Retired', value: pad(rockets.value.filter(rocket => rocket.active === false).length) },
  ])

  onMounted(() => {
    // Uses the store cache; only the first visit hits the API.
    void store.fetchRockets()
  })

  function retry (): void {
    void store.fetchRockets({ force: true })
  }

  function onRocketCreated (): void {
    // Make sure the new rocket is visible at the top of the list.
    store.resetFilters()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>
