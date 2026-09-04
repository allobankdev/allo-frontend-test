<template>
  <v-container class="py-8" max-width="1280">
    <!-- Header Section -->
    <header class="mb-8">
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-6">
        <div>
          <div class="d-flex align-center ga-2 mb-1">
            <v-icon icon="mdi-rocket" color="primary" size="32" />
            <h1 class="text-h4 font-weight-bold">SpaceX Rocket Explorer</h1>
          </div>
          <p class="text-body-1 text-medium-emphasis">
            Explore the launch vehicles engineered by SpaceX, powered by Launch Library 2 API.
          </p>
        </div>

        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          size="large"
          class="align-self-start align-self-md-center"
          @click="showAddDialog = true"
        >
          Add Rocket
        </v-btn>
      </div>

      <!-- Search Filter Bar -->
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <RocketFilter
          v-model="searchQuery"
          @update:model-value="onFilterChange"
        />

        <div class="text-body-2 text-medium-emphasis">
          Showing <strong>{{ store.filteredRockets.length }}</strong> of {{ store.allRockets.length }} rockets
        </div>
      </div>
    </header>

    <!-- Error State -->
    <ErrorState
      v-if="store.error"
      :message="store.error"
      @retry="store.loadRockets(true)"
    />

    <!-- Loading State: Skeleton Cards -->
    <v-row v-else-if="store.loading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="image, article, actions"
          class="rounded-lg border border-opacity-25"
          elevation="2"
        />
      </v-col>
    </v-row>

    <!-- Empty State: Filter Returned No Results -->
    <EmptyState
      v-else-if="store.filteredRockets.length === 0"
      :query="store.searchQuery"
      @clear="clearSearch"
    />

    <!-- Success State: Rocket Cards Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard
          :rocket="rocket"
          @click="navigateToDetail(rocket.id)"
        />
      </v-col>
    </v-row>

    <!-- Add Rocket Modal Dialog -->
    <RocketAddDialog
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/types/rocket'
import RocketCard from '@/components/rocket/RocketCard.vue'
import RocketFilter from '@/components/rocket/RocketFilter.vue'
import RocketAddDialog from '@/components/rocket/RocketAddDialog.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const store = useRocketStore()

const searchQuery = ref(store.searchQuery)
const showAddDialog = ref(false)

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
})

onMounted(() => {
  store.loadRockets()
})

function onFilterChange(val: string): void {
  store.setSearchQuery(val)
}

function clearSearch(): void {
  searchQuery.value = ''
  store.setSearchQuery('')
}

function navigateToDetail(id: string | number): void {
  router.push(`/rockets/${id}`)
}

function handleAddRocket(data: NewRocketInput): void {
  const newRocket = store.addRocket(data)
  snackbar.text = `Rocket "${newRocket.name}" added successfully!`
  snackbar.color = 'success'
  snackbar.show = true
}
</script>
