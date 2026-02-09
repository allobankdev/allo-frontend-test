<template>
  <v-container fluid class="pa-4">
    <!-- Back Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          variant="text"
          color="primary"
          @click="router.back()"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Back to Rockets
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <LoadingState
      v-if="rocketsStore.loading"
      message="Loading rocket details..."
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketsStore.error"
      :message="rocketsStore.error"
      @retry="handleRetry"
    />

    <!-- Rocket Details -->
    <template v-else-if="rocket">
      <v-row>
        <!-- Image Gallery -->
        <v-col cols="12" md="6">
          <v-carousel
            v-if="rocket.flickr_images.length > 0"
            height="500"
            hide-delimiters
            show-arrows="hover"
          >
            <v-carousel-item
              v-for="(image, i) in rocket.flickr_images"
              :key="i"
              :src="image"
              cover
            />
          </v-carousel>

          <v-img
            v-else
            src="https://via.placeholder.com/500x500?text=No+Image"
            height="500"
            cover
          />
        </v-col>

        <!-- Details -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="text-h3 font-weight-bold pa-6">
              {{ rocket.name }}
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-6">
              <!-- Status Chip -->
              <v-chip
                :color="rocket.active ? 'success' : 'error'"
                size="large"
                class="mb-4"
              >
                <v-icon start>
                  {{ rocket.active ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ rocket.active ? 'Active' : 'Inactive' }}
              </v-chip>

              <!-- Description -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Description</h3>
                <p class="text-body-1">{{ rocket.description }}</p>
              </div>

              <v-divider class="my-4" />

              <!-- Key Information -->
              <v-list density="comfortable" class="bg-transparent">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-currency-usd</v-icon>
                  </template>
                  <v-list-item-title>Cost per Launch</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium">
                    {{ formatCost(rocket.cost_per_launch) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-earth</v-icon>
                  </template>
                  <v-list-item-title>Country</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium">
                    {{ rocket.country }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title>First Flight</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium">
                    {{ formatDate(rocket.first_flight) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-office-building</v-icon>
                  </template>
                  <v-list-item-title>Company</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium">
                    {{ rocket.company }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="rocket.success_rate_pct">
                  <template #prepend>
                    <v-icon color="primary">mdi-chart-line</v-icon>
                  </template>
                  <v-list-item-title>Success Rate</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium">
                    {{ rocket.success_rate_pct }}%
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" />

              <!-- Specifications -->
              <div>
                <h3 class="text-h6 mb-3">Specifications</h3>

                <v-row dense>
                  <v-col cols="6">
                    <v-card variant="tonal" color="primary">
                      <v-card-text>
                        <div class="text-caption text-grey-darken-1">Height</div>
                        <div class="text-h6 font-weight-medium">
                          {{ rocket.height.meters }}m
                        </div>
                        <div class="text-caption">{{ rocket.height.feet }}ft</div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="6">
                    <v-card variant="tonal" color="primary">
                      <v-card-text>
                        <div class="text-caption text-grey-darken-1">Diameter</div>
                        <div class="text-h6 font-weight-medium">
                          {{ rocket.diameter.meters }}m
                        </div>
                        <div class="text-caption">{{ rocket.diameter.feet }}ft</div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12">
                    <v-card variant="tonal" color="primary">
                      <v-card-text>
                        <div class="text-caption text-grey-darken-1">Mass</div>
                        <div class="text-h6 font-weight-medium">
                          {{ formatNumber(rocket.mass.kg) }} kg
                        </div>
                        <div class="text-caption">{{ formatNumber(rocket.mass.lb) }} lb</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- External Link -->
              <v-btn
                v-if="rocket.wikipedia"
                :href="rocket.wikipedia"
                target="_blank"
                color="primary"
                variant="outlined"
                block
                class="mt-6"
              >
                <v-icon start>mdi-wikipedia</v-icon>
                Learn More on Wikipedia
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Not Found -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-12">
        <v-icon size="80" color="grey-lighten-1" class="mb-4">
          mdi-rocket-outline
        </v-icon>
        <h3 class="text-h5 mb-2">Rocket not found</h3>
        <p class="text-body-1 text-grey-darken-1 mb-4">
          The rocket you're looking for doesn't exist
        </p>
        <v-btn color="primary" to="/">
          <v-icon start>mdi-arrow-left</v-icon>
          Back to Rockets
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rocketsStore = useRocketsStore()

const rocketId = computed(() => route.params.id as string)

const rocket = computed(() => rocketsStore.getRocketById(rocketId.value))

onMounted(async () => {
  if (!rocket.value) {
    try {
      await rocketsStore.fetchRocketById(rocketId.value)
    } catch (error) {
      console.error('Failed to load rocket:', error)
    }
  }
})

function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cost)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function handleRetry() {
  rocketsStore.clearError()
  rocketsStore.fetchRocketById(rocketId.value)
}
</script>
