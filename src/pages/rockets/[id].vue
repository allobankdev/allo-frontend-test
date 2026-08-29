<template>
  <div class="rocket-detail">
    <v-btn
      icon
      class="back-button"
      @click="goBack"
    >
      <v-icon> mdi-arrow-left </v-icon>
    </v-btn>

    <v-container v-if="rocketStore.detailLoading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="60" />
      <p class="mt-4 detail-loading-text">Loading rocket details...</p>
    </v-container>

    <v-alert v-else-if="rocketStore.detailError" type="error" class="mb-4">
      {{ rocketStore.detailError }}
      <v-btn size="small" @click="loadRocketDetail"> Retry </v-btn>
    </v-alert>

    <div v-else-if="rocketStore.selectedRocket" class="rocket-detail-content">
      <div v-if="detailImages.length" class="rocket-detail-image">
        <v-carousel :show-arrows="detailImages.length > 1">
          <v-carousel-item
            v-for="(image, index) in detailImages"
            :key="index"
          >
            <v-img :src="image" aspect-ratio="16/9" cover />
          </v-carousel-item>
        </v-carousel>
      </div>
      <div v-else class="rocket-detail-image rocket-detail-image--placeholder">
        <v-icon size="100" color="#1976d2"> mdi-rocket </v-icon>
      </div>

      <v-container class="rocket-detail-container">
        <h1 class="rocket-detail-title">{{ rocketStore.selectedRocket.name }}</h1>
        <p v-if="rocketStore.selectedRocket.type" class="rocket-detail-type">
          {{ rocketStore.selectedRocket.type }}
        </p>

        <v-card class="mb-6" variant="outlined">
          <v-card-title> Description </v-card-title>
          <v-card-text>
            {{ rocketStore.selectedRocket.description }}
          </v-card-text>
        </v-card>

        <v-row>
          <v-col v-if="rocketStore.selectedRocket.cost_per_launch" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Cost Per Launch </v-card-title>
              <v-card-text class="rocket-detail-value">
                ${{ formatNumber(rocketStore.selectedRocket.cost_per_launch) }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.country" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Country </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ rocketStore.selectedRocket.country }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.first_flight" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> First Flight </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ formatDate(rocketStore.selectedRocket.first_flight) }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.stages" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Stages </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ rocketStore.selectedRocket.stages }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.engines" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Engines </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ rocketStore.selectedRocket.engines }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Status </v-card-title>
              <v-card-text class="rocket-detail-value">
                <v-chip :color="rocketStore.selectedRocket.active ? 'success' : 'warning'">
                  {{ rocketStore.selectedRocket.active ? 'Active' : 'Inactive' }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.height" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Height </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ rocketStore.selectedRocket.height.meters }} m
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.diameter" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Diameter </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ rocketStore.selectedRocket.diameter.meters }} m
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="rocketStore.selectedRocket.mass" cols="12" sm="6" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle2"> Mass </v-card-title>
              <v-card-text class="rocket-detail-value">
                {{ formatNumber(rocketStore.selectedRocket.mass.kg) }} kg
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div v-if="rocketStore.selectedRocket.wikipedia" class="mt-6">
          <v-btn
            :href="rocketStore.selectedRocket.wikipedia"
            target="_blank"
            color="primary"
            prepend-icon="mdi-wikipedia"
          >
            View on Wikipedia
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container v-else class="text-center py-16">
      <v-icon size="100" class="not-found-icon mb-4"> mdi-alert-circle </v-icon>
      <p class="not-found-text">Rocket not found</p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

const loadRocketDetail = async () => {
  const rocketId = route.params.id as string
  await rocketStore.fetchRocketById(rocketId)
}

const goBack = () => {
  router.back()
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

const detailImages = computed(() => {
  const rocket = rocketStore.selectedRocket
  if (!rocket) return []

  const images: string[] = []

  if (rocket.image) {
    images.push(rocket.image)
  }

  if (rocket.flickr_images?.length) {
    images.push(...rocket.flickr_images)
  }

  return images
})

onMounted(() => {
  loadRocketDetail()
})
</script>

<style scoped>
.rocket-detail {
  min-height: 100vh;
  background-color: #fafafa;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
}

.rocket-detail-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.rocket-detail-image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.rocket-detail-container {
  padding-top: 32px;
}

.rocket-detail-title {
  font-size: 48px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.rocket-detail-type {
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1976d2;
  margin-bottom: 32px;
  font-weight: 600;
}

.rocket-detail-value {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
}

.detail-loading-text {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 16px;
}

.not-found-icon {
  color: #1976d2 !important;
  opacity: 0.7;
}

.not-found-text {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 500;
  margin-top: 12px;
}

:deep(.v-card-title) {
  color: #1976d2 !important;
  font-weight: 600;
}

:deep(.v-card-text) {
  color: #424242 !important;
}

@media (max-width: 960px) {
  .rocket-detail-image {
    height: 300px;
  }

  .rocket-detail-title {
    font-size: 36px;
  }
}

@media (max-width: 600px) {
  .rocket-detail-image {
    height: 250px;
  }

  .rocket-detail-container {
    padding-top: 16px;
  }

  .rocket-detail-title {
    font-size: 28px;
    padding-top: 32px;
  }

  .back-button {
    top: 8px;
    left: 8px;
  }
}
</style>
