<template>
  <v-container class="py-6">
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to Rocket List
    </v-btn>

    <!-- Loading State -->
    <v-card
      v-if="store.detailStatus === 'loading'"
      rounded="lg"
    >
      <v-skeleton-loader type="image, article, list-item-three-line" />
    </v-card>

    <!-- Error / Retry State -->
    <StateErrorRetry
      v-else-if="store.detailStatus === 'error'"
      :message="store.detailError"
      title="Failed to load rocket detail"
      @retry="loadCurrentRocket"
    />

    <!-- Success State -->
    <v-card
      v-else-if="store.selectedRocket"
      class="overflow-hidden"
      rounded="lg"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="5"
        >
          <RocketImage
            :alt="store.selectedRocket.full_name"
            height="100%"
            :src="store.selectedRocket.image_url"
            style="min-height: 320px;"
          />
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <v-card-item class="pa-6 pb-2">
            <div class="d-flex flex-wrap align-center ga-2 mb-2">
              <v-chip
                v-if="store.selectedRocket.family"
                color="primary"
                size="small"
                variant="tonal"
              >
                {{ store.selectedRocket.family }}
              </v-chip>
              <v-chip
                v-if="store.selectedRocket.active !== undefined"
                :color="store.selectedRocket.active ? 'success' : 'default'"
                size="small"
                variant="tonal"
              >
                {{ store.selectedRocket.active ? 'Active' : 'Inactive' }}
              </v-chip>
            </div>

            <h1 class="text-h4 font-weight-bold">
              {{ formatText(store.selectedRocket.full_name, 'Unnamed Rocket') }}
            </h1>
          </v-card-item>

          <v-card-text class="pa-6 pt-2">
            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ formatText(store.selectedRocket.description) }}
            </p>

            <v-divider class="mb-6" />

            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-caption text-medium-emphasis mb-1">
                  Cost per Launch
                </div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ formatLaunchCost(store.selectedRocket.launch_cost) }}
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-caption text-medium-emphasis mb-1">
                  Country
                </div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ formatCountry(store.selectedRocket.manufacturer?.country_code) }}
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <div class="text-caption text-medium-emphasis mb-1">
                  First Flight
                </div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ formatFirstFlight(store.selectedRocket.maiden_flight) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import RocketImage from '@/components/RocketImage.vue'
  import StateErrorRetry from '@/components/StateErrorRetry.vue'
  import { useRocketStore } from '@/stores/rocketStore'
  import {
    formatCountry,
    formatFirstFlight,
    formatLaunchCost,
    formatText,
  } from '@/utils/format'

  const route = useRoute()
  const store = useRocketStore()

  const rocketId = computed(() => {
    const params = route.params as Record<string, string | undefined>
    return Number(params.id)
  })

  function loadCurrentRocket () {
    if (!Number.isNaN(rocketId.value)) {
      store.loadRocketById(rocketId.value)
    }
  }

  onMounted(() => {
    loadCurrentRocket()
  })

  watch(rocketId, () => {
    loadCurrentRocket()
  })
</script>