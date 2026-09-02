<template>
  <v-container class="rocket-list py-8">
    <!-- Header -->
    <div class="rocket-list__header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-medium-emphasis mt-1">
          {{ store.allRockets.length }} rocket{{ store.allRockets.length === 1 ? '' : 's' }} total
        </p>
      </div>
      <AddRocketDialog @submit="store.addRocket" />
    </div>

    <!-- Filter -->
    <RocketFilter
      v-model="filterQuery"
      class="mb-6"
    />

    <!-- State wrapper handles loading / error / success -->
    <AppStateWrapper
      :status="store.status"
      :error-message="store.errorMessage"
      @retry="store.loadRockets"
    >
      <!-- Empty filter result -->
      <div
        v-if="filteredRockets.length === 0"
        class="rocket-list__empty"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="64"
          color="grey-lighten-1"
        />
        <p class="text-medium-emphasis mt-3">
          No rockets match your search.
        </p>
      </div>

      <!-- Rocket grid -->
      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </AppStateWrapper>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'
import { useRocketFilter } from '@/composables/useRocketFilter'

const store = useRocketStore()
const { allRockets } = storeToRefs(store)
const filterQuery = ref('')

const { filteredRockets } = useRocketFilter(allRockets, filterQuery)

onMounted(() => {
  // Only fetch when the list hasn't been loaded yet (avoids re-fetching on back-navigation).
  if (store.status === 'idle') {
    store.loadRockets()
  }
})
</script>

<style scoped>
.rocket-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.rocket-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}
</style>
