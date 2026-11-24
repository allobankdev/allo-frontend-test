<template>
  <v-container class="py-6">
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        :disabled="listStatus !== 'success'"
        prepend-icon="mdi-plus"
        @click="isAddDialogOpen = true"
      >
        Add rocket
      </v-btn>
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

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="onAddRocket"
    />

    <v-snackbar
      v-model="isSnackbarOpen"
      :timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/types/rocket'

const rocketStore = useRocketStore()
const {
  allRockets,
  filteredRockets,
  hasActiveFilter,
  listError,
  listStatus,
  searchQuery,
} = storeToRefs(rocketStore)

const isAddDialogOpen = ref(false)
const isSnackbarOpen = ref(false)
const snackbarMessage = ref('')

const searchFilter = computed<string>({
  get: () => rocketStore.searchQuery,
  set: (value: string | null) => {
    rocketStore.searchQuery = value ?? ''
  },
})

function onAddRocket (input: NewRocketInput): void {
  try {
    const rocket = rocketStore.addLocalRocket(input)
    isAddDialogOpen.value = false
    rocketStore.searchQuery = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    snackbarMessage.value = `"${rocket.name}" was added.`
    isSnackbarOpen.value = true
  } catch (error: unknown) {
    snackbarMessage.value =
      error instanceof Error ? error.message : 'Could not add rocket.'
    isSnackbarOpen.value = true
  }
}

onMounted(() => {
  void rocketStore.loadRockets()
})
</script>
