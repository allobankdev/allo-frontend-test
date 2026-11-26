<template>
  <v-container class="py-6">
    <header class="d-flex flex-wrap align-center ga-4 mb-6">
      <div class="flex-grow-1">
        <h1 class="text-h4">
          Rockets
        </h1>
        <p
          v-if="listStatus === 'success'"
          class="text-medium-emphasis mt-1"
        >
          Showing {{ filteredRockets.length }} of {{ allRockets.length }} rockets
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="isAddDialogOpen = true"
      >
        Add rocket
      </v-btn>
    </header>

    <RocketFilter
      v-model="filters"
      class="mb-6"
    />

    <LoadingState
      v-if="listStatus === 'loading' || listStatus === 'idle'"
      message="Loading rockets…"
    />

    <ErrorState
      v-else-if="listStatus === 'error'"
      :message="listError"
      title="Couldn't load rockets"
      @retry="rocketStore.loadRockets({ force: true })"
    />

    <EmptyState
      v-else-if="filteredRockets.length === 0"
      :message="hasActiveFilters ? 'Try a different search or status.' : 'Add one to get started.'"
      title="No rockets found"
    >
      <template
        v-if="hasActiveFilters"
        #actions
      >
        <v-btn
          variant="tonal"
          @click="rocketStore.resetFilters()"
        >
          Clear filters
        </v-btn>
      </template>
    </EmptyState>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar.show"
      color="success"
      timeout="4000"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          v-if="snackbar.rocketId"
          :to="{ name: '/rockets/[id]', params: { id: snackbar.rocketId } }"
          variant="text"
        >
          View
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rocket'
  import type { NewRocketInput } from '@/types/rocket'

  const rocketStore = useRocketStore()
  const {
    allRockets,
    filteredRockets,
    filters,
    hasActiveFilters,
    listError,
    listStatus,
  } = storeToRefs(rocketStore)

  const isAddDialogOpen = ref(false)
  const snackbar = ref({ show: false, text: '', rocketId: null as string | null })

  // Cached in the store, so coming back from a detail page doesn't refetch.
  onMounted(() => {
    rocketStore.loadRockets()
  })

  function handleAddRocket (input: NewRocketInput) {
    const rocket = rocketStore.addRocket(input)

    // Make sure the new rocket is visible instead of hidden by the current filters.
    rocketStore.resetFilters()

    snackbar.value = { show: true, text: `"${rocket.name}" added`, rocketId: rocket.id }
  }
</script>
