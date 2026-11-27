<template>
  <v-container class="py-6 py-md-8">
    <div class="mb-6">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="text"
        @click="goBack"
      >
        Back to Rocket List
      </v-btn>
    </div>

    <StateLoading
      v-if="rocketStore.detailLoading"
      message="Loading rocket details..."
    />

    <StateError
      v-else-if="rocketStore.detailError"
      :message="rocketStore.detailError"
      title="Failed to load rocket details"
      @retry="handleRetry"
    />

    <v-card
      v-else-if="rocket"
      class="overflow-hidden"
      rounded="lg"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="5"
        >
          <RocketImage
            :alt="rocket.name"
            height="100%"
            :src="rocket.imageUrl"
          />
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <div class="pa-6 pa-md-8">
            <div class="d-flex flex-wrap align-center ga-2 mb-3">
              <h1 class="text-h4 font-weight-bold">
                {{ rocket.name }}
              </h1>
              <v-chip
                v-if="rocket.isLocal"
                color="primary"
                label
                size="small"
                variant="tonal"
              >
                Added Locally
              </v-chip>
            </div>

            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ formatFallbackText(rocket.description, 'No description available for this rocket.') }}
            </p>

            <v-divider class="mb-6" />

            <h2 class="text-subtitle-1 font-weight-bold mb-4">
              Specifications
            </h2>

            <v-row dense>
              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="pa-4 fill-height"
                  rounded="lg"
                >
                  <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
                    <v-icon
                      class="mr-1"
                      icon="mdi-currency-usd"
                      size="16"
                    />
                    Cost per Launch
                  </div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ formatLaunchCost(rocket.costPerLaunch) }}
                  </div>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="pa-4 fill-height"
                  rounded="lg"
                >
                  <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
                    <v-icon
                      class="mr-1"
                      icon="mdi-earth"
                      size="16"
                    />
                    Country
                  </div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ formatFallbackText(rocket.country, 'Unknown') }}
                  </div>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="pa-4 fill-height"
                  rounded="lg"
                >
                  <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
                    <v-icon
                      class="mr-1"
                      icon="mdi-calendar-star"
                      size="16"
                    />
                    First Flight
                  </div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ formatFlightDate(rocket.firstFlight) }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import RocketImage from '@/components/RocketImage.vue'
  import StateError from '@/components/StateError.vue'
  import StateLoading from '@/components/StateLoading.vue'
  import { useRocketStore } from '@/stores/rockets'
  import {
    formatFallbackText,
    formatFlightDate,
    formatLaunchCost,
  } from '@/utils/formatters'

  const route = useRoute()
  const router = useRouter()
  const rocketStore = useRocketStore()

  const rocketId = computed(() => {
    const rawId = (route.params as Record<string, string | string[] | undefined>).id
    return Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  })

  const rocket = computed(() => rocketStore.selectedRocket)

  function fetchDetail () {
    rocketStore.loadRocketById(rocketId.value)
  }

  onMounted(() => {
    fetchDetail()
  })

  watch(rocketId, () => {
    fetchDetail()
  })

  function handleRetry () {
    fetchDetail()
  }

  function goBack () {
    router.push('/')
  }
</script>