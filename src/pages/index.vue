<template>
  <v-container
    class="py-8 py-md-10 px-4"
    max-width="1200"
  >
    <section class="mb-8">
      <div class="d-flex flex-column flex-md-row align-md-end justify-space-between ga-4">
        <div>
          <v-chip
            class="mb-3"
            color="primary"
            prepend-icon="mdi-orbit"
            size="small"
            variant="tonal"
          >
            SpaceX Fleet
          </v-chip>

          <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2">
            SpaceX Rockets
          </h1>

          <p
            class="text-body-1 text-medium-emphasis mb-0"
            style="max-width: 640px;"
          >
            Browse SpaceX launch vehicles from Launch Library 2, filter by rocket name, or add
            your own custom rocket entry.
          </p>
        </div>

        <v-btn
          class="align-self-stretch align-self-sm-start align-self-md-end"
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          size="large"
          variant="flat"
          @click="isAddDialogOpen = true"
        >
          Add Rocket
        </v-btn>
      </div>
    </section>

    <section class="mb-6">
      <v-row align="center">
        <v-col
          cols="12"
          md="6"
          sm="8"
        >
          <v-text-field
            v-model="searchQuery"
            bg-color="#0f172a"
            clearable
            density="comfortable"
            hide-details
            placeholder="Search rockets by name..."
            prepend-inner-icon="mdi-magnify"
            rounded="lg"
            variant="outlined"
          />
        </v-col>

        <v-col
          class="d-flex justify-sm-end"
          cols="12"
          md="6"
          sm="4"
        >
          <v-chip
            color="secondary"
            variant="tonal"
          >
            {{ rocketCountLabel }}
          </v-chip>
        </v-col>
      </v-row>
    </section>

    <v-progress-linear
      v-if="rocketStore.isLoading && rocketStore.allRockets.length > 0"
      class="mb-6"
      color="primary"
      indeterminate
      rounded
    />

    <v-alert
      v-if="rocketStore.error"
      border="start"
      class="mb-6"
      color="error"
      rounded="xl"
      variant="tonal"
    >
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <div class="text-subtitle-1 font-weight-bold mb-1">
            Failed to load SpaceX rockets
          </div>
          <div class="text-body-2">
            {{ rocketStore.error }}
          </div>
        </div>

        <v-btn
          color="error"
          :loading="rocketStore.isLoading"
          prepend-icon="mdi-refresh"
          rounded="lg"
          variant="flat"
          @click="handleRetry"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <v-row v-if="isInitialLoading">
      <v-col
        v-for="item in 6"
        :key="item"
        cols="12"
        md="4"
        sm="6"
      >
        <v-skeleton-loader
          border
          color="#0f172a"
          rounded="xl"
          type="image, article, actions"
        />
      </v-col>
    </v-row>

    <v-row v-else-if="filteredRockets.length > 0">
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

    <EmptyState
      v-else-if="!rocketStore.error"
      :description="emptyStateContent.description"
      :icon="emptyStateContent.icon"
      :title="emptyStateContent.title"
    />

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbarState.visible"
      color="success"
      location="bottom end"
      max-width="calc(100vw - 32px)"
      rounded="lg"
      timeout="3500"
    >
      {{ snackbarState.message }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { type NewRocketInput, useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'
import { formatRocketName } from '@/utils/rocketFormatter'

const rocketStore = useRocketStore()

const searchQuery = ref('')
const isAddDialogOpen = ref(false)
const snackbarState = reactive({
  visible: false,
  message: '',
})

onMounted(() => {
  void rocketStore.loadRockets()
})

const normalizedSearch = computed(() => (searchQuery.value ?? '').trim().toLowerCase())

const filteredRockets = computed<Rocket[]>(() => {
  if (normalizedSearch.value.length === 0) {
    return rocketStore.allRockets
  }

  return rocketStore.allRockets.filter((rocket) => {
    const rocketName = (rocket.full_name ?? '').toLowerCase()
    return rocketName.includes(normalizedSearch.value)
  })
})

const isInitialLoading = computed(
  () => rocketStore.isLoading && rocketStore.allRockets.length === 0,
)

const rocketCountLabel = computed(() => {
  const shown = filteredRockets.value.length
  const total = rocketStore.allRockets.length

  if (normalizedSearch.value.length > 0 && total > 0) {
    return `Showing ${shown} of ${total} rockets`
  }

  return `${shown} ${shown === 1 ? 'rocket' : 'rockets'}`
})

const emptyStateContent = computed(() => {
  if (rocketStore.allRockets.length > 0) {
    return {
      title: 'No matching rockets found',
      description: 'No rockets matched your search. Try another keyword or clear the search filter.',
      icon: 'mdi-magnify-close',
    }
  }

  return {
    title: 'No rockets available',
    description: 'There are currently no rockets in the list. Retry loading from the API or add a custom rocket.',
    icon: 'mdi-rocket-off-outline',
  }
})

function handleRetry(): void {
  void rocketStore.loadRockets(true)
}

function handleAddRocket(payload: NewRocketInput): void {
  const created = rocketStore.addCustomRocket(payload)
  searchQuery.value = ''
  snackbarState.message = `"${formatRocketName(created.full_name)}" added to your rocket list.`
  snackbarState.visible = true
}
</script>
