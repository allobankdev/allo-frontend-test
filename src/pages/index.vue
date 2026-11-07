<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Rocket Explorer
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Explore SpaceX rockets and discover their specifications.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <RocketFilters />
    
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 my-5">
      <div>
        <p class="text-subtitle-1 font-weight-medium">
          {{ store.filteredRockets.length }} Rockets Found
        </p>

        <p class="text-body-2 text-medium-emphasis">
          Explore launch vehicles and their specifications.
        </p>
      </div>

      <v-chip
        v-if="store.customRockets.length > 0"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-rocket-launch"
      >
        {{ store.customRockets.length }} Custom Rockets
      </v-chip>
    </div>

    <div
      v-if="(store.status === 'loading' || store.status === 'idle') && store.customRockets.length === 0"
      class="d-flex flex-column align-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
        class="mb-4"
      />
      <p>Loading rockets...</p>
    </div>

    <v-alert
      v-if="store.status === 'error'"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ store.errorMessage }}</span>

        <v-btn
          color="error"
          variant="outlined"
          @click="store.loadRockets()"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <template v-if="store.status === 'success' || store.customRockets.length > 0">
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        No rockets found.
      </v-alert>
    </template>

    <AddRocketDialog
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />
    
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      :timeout="3000"
      location="bottom right"
    >
      Rocket successfully added!

      <template #actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>



<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import type { RocketInput } from '@/types/rocket'

const store = useRocketStore()
const showAddDialog = ref(false)
const showSnackbar = ref(false)

function handleAddRocket(input: RocketInput) {
  store.addRocket(input)

  store.searchQuery = ''
  store.countryFilter = ''
  store.statusFilter = 'all'

  showSnackbar.value = true
}

onMounted(() => {
  store.ensureLoaded()
})

onBeforeUnmount(() => {
  store.cancelFetch()
})
</script>
