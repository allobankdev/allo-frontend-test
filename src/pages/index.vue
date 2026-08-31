<template>
  <v-container
    class="py-6 px-4"
    style="max-width: 800px;"
  >
    <!-- App Header -->
    <header class="d-flex align-center justify-space-between pb-3 border-bottom-line mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold text-onSurface tracking-tight">
          ROCKET EXPLORER
        </h1>
        <p class="text-caption text-steel font-mono mb-0">
          SPACEX FLIGHT MANIFEST & SPEC DATA
        </p>
      </div>
      <v-chip
        variant="flat"
        color="steel"
        size="small"
        class="font-mono font-weight-bold"
      >
        SYSTEM: ONLINE
      </v-chip>
    </header>

    <!-- Filter & Add Rocket Controls -->
    <FilterBar
      :model-value="store.filterQuery"
      @update:model-value="store.setFilterQuery"
      @open-add-dialog="isAddDialogOpen = true"
    />

    <!-- UI States -->

    <!-- 1. Loading State -->
    <LoadingState v-if="store.status === 'loading'" />

    <!-- 2. Error State -->
    <ErrorState
      v-else-if="store.status === 'error'"
      :error-message="store.errorMessage"
      @retry="store.retry()"
    />

    <!-- 3. Success State with Results -->
    <div v-else-if="store.status === 'success' || store.rockets.length > 0">
      <!-- Empty Filter Results -->
      <v-card
        v-if="store.filteredRockets.length === 0"
        class="my-6 pa-6 text-center border-line bg-surface"
        variant="outlined"
      >
        <v-icon
          icon="mdi-file-search-outline"
          color="steel"
          size="36"
          class="mb-2"
        />
        <div class="text-body-1 font-weight-medium text-onSurface">
          No rockets match "{{ store.filterQuery }}".
        </div>
        <p class="text-caption text-steel font-mono mt-1 mb-3">
          Check your search query or add a new rocket to the manifest.
        </p>
        <v-btn
          color="steel"
          variant="outlined"
          size="small"
          class="text-none"
          @click="store.setFilterQuery('')"
        >
          Clear filter
        </v-btn>
      </v-card>

      <!-- Manifest List -->
      <div
        v-else
        class="rocket-manifest-list"
      >
        <div class="d-flex align-center justify-space-between mb-2 px-1">
          <span class="spec-label">MANIFEST ENTRIES ({{ store.filteredRockets.length }})</span>
          <span
            v-if="store.filterQuery"
            class="spec-label text-primary"
          >
            FILTERED BY "{{ store.filterQuery.toUpperCase() }}"
          </span>
        </div>

        <RocketListItem
          v-for="(rocket, index) in store.filteredRockets"
          :key="rocket.id"
          :rocket="rocket"
          :index="index"
          @click="goToDetail(rocket.id)"
        />
      </div>
    </div>

    <!-- Modal Form: Add Rocket -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'
import RocketListItem from '@/components/RocketListItem.vue'
import FilterBar from '@/components/FilterBar.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const store = useRocketsStore()

const isAddDialogOpen = ref(false)

onMounted(() => {
  store.fetchRockets()
})

function goToDetail(id: string) {
  router.push(`/rocket/${id}`)
}

function handleAddRocket(data: Omit<Rocket, 'id' | 'isLocal'>) {
  store.addLocalRocket(data)
}
</script>
