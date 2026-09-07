<template>
  <div>
    <!-- Page Header & Action Banner -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-6 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">SpaceX Rocket Catalog</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Explore all {{ store.combinedRockets.length }} SpaceX launch vehicles and rockets.
        </p>
      </div>

      <AddRocketDialog />
    </div>

    <!-- Filter Component -->
    <RocketFilter />

    <!-- State Feedback (Loading / Error / Empty) -->
    <StateFeedback />

    <!-- Rocket Grid -->
    <v-row v-if="store.status === 'success' && store.filteredRockets.length > 0">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import StateFeedback from '@/components/StateFeedback.vue'

const store = useRocketStore()

onMounted(() => {
  store.fetchRockets()
})
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
