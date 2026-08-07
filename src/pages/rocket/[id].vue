<template>
  <v-container class="py-8">
    <!-- Back navigation -->
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack" class="text-none">
        Back to Fleet
      </v-btn>
    </div>

    <!-- UI State: Loading (Custom Skeleton for Detail Layout) -->
    <template v-if="store.isDetailLoading">
      <v-skeleton-loader type="image" height="400" class="rounded-xl mb-6"></v-skeleton-loader>
      <v-row>
        <v-col cols="12" md="8"><v-skeleton-loader type="article"></v-skeleton-loader></v-col>
        <v-col cols="12" md="4"><v-skeleton-loader type="list-item-three-line"></v-skeleton-loader></v-col>
      </v-row>
    </template>

    <!-- UI State: Error -->
    <ErrorState v-else-if="store.detailError" :message="store.detailError" @retry="loadData" />

    <!-- UI State: Success -->
    <template v-else-if="rocket">
      <!-- Hero Image Section -->
      <v-card elevation="0" class="rounded-xl overflow-hidden mb-8">
        <v-img
          :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/1200x400'"
          height="400"
          cover
          gradient="to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%"
          class="align-end bg-grey-lighten-2"
        >
          <div class="pa-6 w-100">
            <h1 class="text-h3 font-weight-bold text-white mb-2">{{ rocket.name }}</h1>
            <v-chip
              :color="rocket.active ? 'success' : 'grey'"
              variant="flat"
              class="font-weight-bold"
            >
              {{ rocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
        </v-img>
      </v-card>

      <!-- Specifications Grid -->
      <v-row>
        <!-- Left Column: Description & Dimensions -->
        <v-col cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-4">Overview</h2>
          <p class="text-body-1 text-grey-darken-3 mb-8" style="line-height: 1.8;">
            {{ rocket.description }}
          </p>

          <h3 class="text-h6 font-weight-bold mb-4">Dimensions & Mass</h3>
          <v-row>
            <v-col cols="12" sm="4">
              <v-card variant="outlined" class="pa-4 rounded-lg bg-white">
                <div class="text-caption text-grey-darken-1 text-uppercase">Height</div>
                <div class="text-h6 font-weight-bold">{{ rocket.height?.meters || 0 }} m</div>
                <div class="text-caption text-grey">{{ rocket.height?.feet || 0 }} ft</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="outlined" class="pa-4 rounded-lg bg-white">
                <div class="text-caption text-grey-darken-1 text-uppercase">Diameter</div>
                <div class="text-h6 font-weight-bold">{{ rocket.diameter?.meters || 0 }} m</div>
                <div class="text-caption text-grey">{{ rocket.diameter?.feet || 0 }} ft</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="outlined" class="pa-4 rounded-lg bg-white">
                <div class="text-caption text-grey-darken-1 text-uppercase">Mass</div>
                <div class="text-h6 font-weight-bold">{{ formatNumber(rocket.mass?.kg) }} kg</div>
                <div class="text-caption text-grey">{{ formatNumber(rocket.mass?.lb) }} lb</div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- Right Column: Engines & Financials -->
        <v-col cols="12" md="4">
          <v-card class="rounded-xl pa-6 bg-grey-lighten-4 mb-6" elevation="0">
            <h3 class="text-h6 font-weight-bold mb-4">Engine Specs</h3>
            <v-list class="bg-transparent pa-0">
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-medium text-capitalize">{{ rocket.engines?.type }} {{ rocket.engines?.version }}</v-list-item-title>
                <v-list-item-subtitle>Type</v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-medium text-capitalize">{{ rocket.engines?.layout }}</v-list-item-title>
                <v-list-item-subtitle>Layout</v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-medium text-capitalize">{{ rocket.engines?.propellant_1 }} & {{ rocket.engines?.propellant_2 }}</v-list-item-title>
                <v-list-item-subtitle>Propellants</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>

          <v-card class="rounded-xl pa-6 bg-blue-darken-4 text-white" elevation="2">
            <h3 class="text-h6 font-weight-bold mb-4">Financials</h3>
            <div class="mb-4">
              <div class="text-caption text-white-lighten-3 text-uppercase">Cost per Launch</div>
              <div class="text-h4 font-weight-bold">${{ formatCost(rocket.cost_per_launch) }}</div>
            </div>
            <div>
              <div class="text-caption text-white-lighten-3 text-uppercase">Success Rate</div>
              <div class="text-h5 font-weight-bold">{{ rocket.success_rate_pct || 0 }}%</div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import ErrorState from '@/components/common/ErrorState.vue'

// Init store and router utilities
const store = useRocketStore()
const route = useRoute()
const router = useRouter()

// 1. Computed property alias for cleaner template
const rocket = computed(() => store.selectedRocket)

// 5. Centralize routing logic
const goBack = () => router.push('/')

// Fetch action wrapper for reuse in error state
const loadData = () => {
  const id = route.params.id as string
  if (id) store.fetchRocketById(id)
}

// 3. Defensive Programming: Null-safe formatter
const formatNumber = (num?: number | null) => {
  if (num == null) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

// 2. Extracted Math Logic: Format cost calculation
const formatCost = (val?: number | null) => {
  if (val == null) return '0'
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1) + 'M'
  }
  // For small simulated rockets
  return new Intl.NumberFormat('en-US').format(val)
}

// Fetch data on arrival
onMounted(() => {
  loadData()
})

// Prevent memory leak / UI flash on exit
onUnmounted(() => {
  store.clearSelectedRocket()
})
</script>
