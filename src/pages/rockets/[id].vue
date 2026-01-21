<template>
  <v-container fluid class="rocket-detail-page">
    <!-- Loading State -->
    <LoadingState v-if="rocketStore.loading" message="Loading rocket details..." />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="loadRocket"
    />

    <!-- Rocket Details -->
    <div v-else-if="rocketStore.currentRocket">
      <!-- Back Button -->
      <v-row>
        <v-col cols="12">
          <v-btn
            variant="text"
            @click="goBack"
            class="mb-4"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Back to Rockets
          </v-btn>
        </v-col>
      </v-row>

      <!-- Rocket Header -->
      <v-row>
        <v-col cols="12">
          <div class="rocket-header">
            <h1 class="rocket-title">{{ rocketStore.currentRocket.name }}</h1>
            <v-chip
              :color="rocketStore.currentRocket.active ? 'success' : 'grey'"
              size="large"
              class="ml-4"
            >
              {{ rocketStore.currentRocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- Main Content Row -->
      <v-row class="mt-4">
        <!-- Left Column: Image Gallery -->
        <v-col cols="12" md="5">
          <v-carousel
            v-if="rocketImages.length > 0"
            height="500"
            show-arrows="hover"
            hide-delimiter-background
            cycle
          >
            <v-carousel-item
              v-for="(image, index) in rocketImages"
              :key="index"
              :src="image"
              cover
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-carousel-item>
          </v-carousel>
          <div v-else class="no-image-placeholder">
            <v-icon size="120" color="grey-lighten-2">mdi-rocket-outline</v-icon>
            <p class="mt-4">No images available</p>
          </div>
        </v-col>

        <!-- Right Column: Details Section -->
        <v-col cols="12" md="7">
          <v-row>
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title class="text-h5 pa-4 bg-primary">
                  <v-icon start color="white">mdi-information-outline</v-icon>
                  <span class="text-white">Description</span>
                </v-card-title>
                <v-card-text class="pa-6">
                  <p class="rocket-description-text">
                    {{ rocketStore.currentRocket.description || 'No description available for this rocket.' }}
                  </p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <!-- Key Information Card -->
              <v-card elevation="2">
                <v-card-title class="text-h5 pa-4 bg-primary">
                  <v-icon start color="white">mdi-information</v-icon>
                  <span class="text-white">Rocket Information</span>
                </v-card-title>
                <v-card-text class="pa-4">
                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <v-icon color="primary" size="30">mdi-currency-usd</v-icon>
                    </div>
                    <div class="info-content">
                      <p class="info-label">Cost Per Launch</p>
                      <p class="info-value">${{ (rocketStore.currentRocket.cost_per_launch / 1000000).toFixed(1) }}M</p>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <v-icon color="primary" size="30">mdi-flag</v-icon>
                    </div>
                    <div class="info-content">
                      <p class="info-label">Country</p>
                      <p class="info-value">{{ rocketStore.currentRocket.country }}</p>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <v-icon color="primary" size="30">mdi-calendar</v-icon>
                    </div>
                    <div class="info-content">
                      <p class="info-label">First Flight</p>
                      <p class="info-value">{{ rocketStore.currentRocket.first_flight }}</p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>


    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const route = useRoute()
const rocketStore = useRocketStore()

onMounted(() => {
  loadRocket()
})

async function loadRocket() {
  const id = route.params.id as string
  await rocketStore.fetchRocketById(id)
}

function goBack() {
  router.push('/rockets')
}

const rocketImages = computed(() => {
  if (!rocketStore.currentRocket) return []
  return rocketStore.currentRocket.flickr_images || []
})
</script>
