<template>
  <v-container class="page-container py-8">
    <v-sheet
      class="hero-banner rounded-xl pa-6 pa-sm-8 mb-6"
      elevation="3"
    >
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <div class="d-flex align-center flex-wrap ga-3 mb-2">
            <h1 class="text-h4 text-sm-h3 font-weight-bold">
              SpaceX Rockets
            </h1>
            <v-chip
              v-if="listStatus === 'success'"
              color="secondary"
              prepend-icon="mdi-rocket-launch"
              size="small"
              variant="tonal"
            >
              {{ allRockets.length }} {{ allRockets.length === 1 ? 'rocket' : 'rockets' }}
            </v-chip>
          </div>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Explore the vehicles that changed spaceflight.
          </p>
        </div>

        <v-btn
          class="align-self-start align-self-sm-center"
          color="primary"
          :disabled="listStatus !== 'success'"
          prepend-icon="mdi-plus"
          size="large"
          variant="flat"
          @click="isAddDialogOpen = true"
        >
          Add rocket
        </v-btn>
      </div>
    </v-sheet>

    <v-card
      class="rounded-lg pa-3 mb-6"
      elevation="2"
    >
      <v-text-field
        v-model="searchFilter"
        clearable
        density="comfortable"
        hide-details
        label="Filter by name"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </v-card>

    <LoadingState
      v-if="listStatus === 'loading' || listStatus === 'idle'"
      label="Loading rockets..."
    />

    <ErrorState
      v-else-if="listStatus === 'error'"
      :message="listError ?? 'Something went wrong. Please try again.'"
      @retry="rocketStore.retryLoadRockets()"
    />

    <v-sheet
      v-else-if="filteredRockets.length === 0"
      class="text-center py-12 px-4 rounded-lg"
      color="surface"
      elevation="1"
    >
      <v-icon
        class="mb-4"
        color="secondary"
        icon="mdi-rocket-launch-outline"
        size="64"
      />
      <template v-if="hasActiveFilter">
        <p class="text-body-1 text-medium-emphasis mb-5">
          No rockets match "{{ searchQuery.trim() }}".
        </p>
        <v-btn
          color="primary"
          prepend-icon="mdi-filter-remove-outline"
          variant="tonal"
          @click="searchFilter = ''"
        >
          Clear filter
        </v-btn>
      </template>
      <p
        v-else
        class="text-body-1 text-medium-emphasis mb-0"
      >
        No rockets available.
      </p>
    </v-sheet>

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

<style scoped>
.page-container {
  max-width: 1200px;
}

.hero-banner {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.18) 0%,
    rgba(var(--v-theme-secondary), 0.1) 50%,
    rgba(var(--v-theme-surface), 0.95) 100%
  );
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}
</style>
