<template>
  <v-container class="py-6">
    <!-- Loading State -->
    <template v-if="store.listStatus === 'loading' || store.listStatus === 'idle'">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
        <div style="width: 100%; max-width: 340px;">
          <v-skeleton-loader
            class="bg-transparent"
            type="heading, text"
          />
        </div>

        <v-skeleton-loader
          class="bg-transparent"
          type="button"
          width="140"
        />
      </div>

      <v-row class="mb-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            height="48"
            rounded="lg"
            type="ossein"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <v-skeleton-loader
            height="48"
            rounded="lg"
            type="ossein"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <v-skeleton-loader
            height="48"
            rounded="lg"
            type="ossein"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="n in 6"
          :key="n"
          cols="12"
          md="4"
          sm="6"
        >
          <v-skeleton-loader
            rounded="lg"
            type="image, article"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Header (tampil saat bukan loading) -->
    <div
      v-else
      class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Explore SpaceX launch vehicles from Launch Library 2
        </p>
      </div>

      <v-btn
        v-if="store.listStatus === 'success'"
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="isAddDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- Error / Retry State -->
    <StateErrorRetry
      v-if="store.listStatus === 'error'"
      :message="store.listError"
      title="Failed to load rockets"
      @retry="store.loadRockets(true)"
    />

    <!-- Success State -->
    <template v-else-if="store.listStatus === 'success'">
      <RocketFilterBar
        v-model:search="searchQuery"
        v-model:selected-family="selectedFamily"
        v-model:status-filter="statusFilter"
        :families="store.availableFamilies"
        :is-searching="isSearching"
      />

      <p class="text-body-2 text-medium-emphasis mb-4">
        Showing {{ filteredRockets.length }} of {{ store.allRockets.length }} rockets
      </p>

      <v-row v-if="filteredRockets.length > 0">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <v-sheet
        v-else
        border
        class="pa-8 text-center my-4"
        rounded="lg"
      >
        <v-icon
          color="medium-emphasis"
          icon="mdi-rocket-outline"
          size="48"
        />
        <p class="text-h6 mt-3 mb-1">
          No rockets match your filter
        </p>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Try adjusting your search or filter criteria.
        </p>
        <v-btn
          variant="outlined"
          @click="resetFilters"
        >
          Reset Filters
        </v-btn>
      </v-sheet>
    </template>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      :families="store.availableFamilies"
      @submit="handleAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketFilterBar, { type RocketStatusFilter } from '@/components/RocketFilterBar.vue'
  import StateErrorRetry from '@/components/StateErrorRetry.vue'
  import { useRocketStore } from '@/stores/rocketStore'
  import type { NewRocketPayload } from '@/types/rocket'

  const store = useRocketStore()

  const searchQuery = ref('')
  const debouncedSearchQuery = ref('')
  const isSearching = computed(() => searchQuery.value !== debouncedSearchQuery.value)
  const selectedFamily = ref<string | null>(null)
  const statusFilter = ref<RocketStatusFilter>('all')
  const isAddDialogOpen = ref(false)

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(searchQuery, newValue => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = newValue
    }, 500)
  })

  const filteredRockets = computed(() => {
    const query = debouncedSearchQuery.value.trim().toLowerCase()

    return store.allRockets.filter(rocket => {
      const matchesSearch = !query
        || rocket.full_name.toLowerCase().includes(query)
        || (rocket.description?.toLowerCase().includes(query) ?? false)

      const matchesFamily = !selectedFamily.value
        || rocket.family === selectedFamily.value

      const matchesStatus = statusFilter.value === 'all'
        || (statusFilter.value === 'active' && rocket.active === true)
        || (statusFilter.value === 'inactive' && rocket.active === false)

      return matchesSearch && matchesFamily && matchesStatus
    })
  })

  function resetFilters () {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
    selectedFamily.value = null
    statusFilter.value = 'all'
  }

  function handleAddRocket (payload: NewRocketPayload) {
    store.addRocket(payload)
  }

  onMounted(() => {
    store.loadRockets()
  })

  onUnmounted(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
  })
</script>