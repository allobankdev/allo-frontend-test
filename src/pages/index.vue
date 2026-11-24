<template>
  <v-container class="py-6">
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
    </div>

    <div class="mb-6">
      <v-text-field
        v-model="searchFilter"
        clearable
        hide-details
        label="Filter by name"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </div>

    <LoadingState
      v-if="listStatus === 'loading' || listStatus === 'idle'"
      label="Loading rockets..."
    />

    <ErrorState
      v-else-if="listStatus === 'error'"
      :message="listError ?? 'Something went wrong. Please try again.'"
      @retry="rocketStore.retryLoadRockets()"
    />

    <div
      v-else-if="filteredRockets.length === 0"
      class="text-center py-12"
    >
      <template v-if="hasActiveFilter">
        <p class="text-body-1 text-medium-emphasis mb-4">
          No rockets match "{{ searchQuery.trim() }}".
        </p>
        <v-btn
          color="primary"
          variant="tonal"
          @click="searchFilter = ''"
        >
          Clear filter
        </v-btn>
      </template>
      <p
        v-else
        class="text-body-1 text-medium-emphasis"
      >
        No rockets available.
      </p>
    </div>

    <div v-else>
      <p
        aria-live="polite"
        class="text-caption text-medium-emphasis mb-4"
      >
        Showing {{ filteredRockets.length }} of {{ allRockets.length }} rockets
      </p>

      <v-row>
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
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'

const rocketStore = useRocketStore()
const {
  allRockets,
  filteredRockets,
  hasActiveFilter,
  listError,
  listStatus,
  searchQuery,
} = storeToRefs(rocketStore)

const searchFilter = computed<string>({
  get: () => rocketStore.searchQuery,
  set: (value: string | null) => {
    rocketStore.searchQuery = value ?? ''
  },
})

onMounted(() => {
  void rocketStore.loadRockets()
})
</script>
