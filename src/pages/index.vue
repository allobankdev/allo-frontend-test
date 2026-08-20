<template>
  <div class="app-page app-shell">
    <section class="page-heading">
      <div>
        <span class="section-kicker">Launcher configurations</span>
        <h1>SpaceX rocket catalog</h1>
        <p>Active, retired, and experimental vehicles from Launch Library 2.</p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        @click="dialogOpen = true"
      >
        Add rocket
      </v-btn>
    </section>

    <section
      aria-label="Rocket filters"
      class="catalog-toolbar"
    >
      <v-text-field
        v-model="query"
        aria-label="Search rockets"
        class="catalog-toolbar__search"
        clearable
        hide-details
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
      />

      <v-btn-toggle
        v-model="family"
        aria-label="Filter by rocket family"
        class="catalog-toolbar__families"
        color="primary"
        mandatory
        variant="outlined"
      >
        <v-btn
          v-for="option in familyOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </section>

    <RocketListSkeleton
      v-if="listStatus === 'loading' && rockets.length === 0"
    />

    <AppFeedback
      v-else-if="listStatus === 'error' && rockets.length === 0"
      action-icon="mdi-refresh"
      action-label="Retry"
      icon="mdi-cloud-alert-outline"
      :message="listError || 'Rocket data could not be loaded.'"
      mode="error"
      title="Unable to load rockets"
      @action="load(true)"
    />

    <template v-else>
      <v-alert
        v-if="listStatus === 'error'"
        class="catalog-alert"
        color="error"
        icon="mdi-alert-circle-outline"
        variant="tonal"
      >
        <div>
          <strong>Latest data could not be refreshed.</strong>
          <span>{{ listError }}</span>
        </div>
        <template #append>
          <v-btn
            color="error"
            variant="text"
            @click="load(true)"
          >
            Retry
          </v-btn>
        </template>
      </v-alert>

      <div
        class="catalog-summary"
        aria-live="polite"
      >
        <strong>{{ resultLabel }}</strong>
        <span>{{ filterLabel }}</span>
      </div>

      <v-row
        v-if="filteredRockets.length"
        class="rocket-grid"
      >
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          lg="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <AppFeedback
        v-else
        action-icon="mdi-filter-remove-outline"
        action-label="Clear filters"
        icon="mdi-magnify-close"
        message="Try a different name or rocket family."
        title="No matching rockets"
        @action="clearFilters"
      />
    </template>

    <AddRocketDialog
      v-model="dialogOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbarOpen"
      color="success"
      timeout="3500"
    >
      <v-icon
        class="mr-2"
        icon="mdi-check-circle-outline"
      />
      {{ addedRocketName }} was added to the catalog.
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRocketList } from '@/composables/useRocketList'
  import { useRocketStore } from '@/stores/rocket'
  import type { NewRocketInput } from '@/types/rocket'
  import { filterRockets, type RocketFamily } from '@/utils/rocket'

  const store = useRocketStore()
  const { rockets, listError, listStatus, load } = useRocketList()
  const query = ref('')
  const family = ref<RocketFamily>('all')
  const dialogOpen = ref(false)
  const snackbarOpen = ref(false)
  const addedRocketName = ref('Rocket')

  const familyOptions: { label: string, value: RocketFamily }[] = [
    { label: 'All', value: 'all' },
    { label: 'Falcon', value: 'falcon' },
    { label: 'Starship', value: 'starship' },
    { label: 'Other', value: 'other' },
  ]

  const filteredRockets = computed(() => filterRockets(
    rockets.value,
    query.value,
    family.value,
  ))

  const resultLabel = computed(() => {
    const count = filteredRockets.value.length
    return `${count} ${count === 1 ? 'rocket' : 'rockets'}`
  })

  const filterLabel = computed(() => {
    if (!query.value && family.value === 'all') return 'Complete SpaceX catalog'
    return `Showing ${filteredRockets.value.length} of ${rockets.value.length}`
  })

  function clearFilters () {
    query.value = ''
    family.value = 'all'
  }

  function handleAddRocket (input: NewRocketInput) {
    const rocket = store.addRocket(input)
    clearFilters()
    addedRocketName.value = rocket.full_name || 'Rocket'
    snackbarOpen.value = true
  }
</script>
