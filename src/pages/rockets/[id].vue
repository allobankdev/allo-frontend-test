<template>
  <div class="rocket-detail-page">
    <!-- Loading State -->
    <v-container v-if="loading" class="py-16">
      <v-row>
        <v-col cols="12" class="text-center py-16">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
          />
          <p class="mt-6 text-h6">Loading rocket data...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error State -->
    <v-container v-else-if="error" class="py-16">
      <v-row>
        <v-col cols="12" class="text-center py-16">
          <v-icon size="80" color="error">mdi-alert-circle-outline</v-icon>
          <p class="mt-6 text-h6">{{ error }}</p>
          <div class="mt-6">
            <v-btn
              color="primary"
              size="large"
              class="mr-4"
              @click="handleRetry"
            >
              Retry Connection
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              @click="goBack"
            >
              Back to Fleet
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success State -->
    <div v-else-if="rocket">
      <!-- Header -->
      <v-sheet class="detail-header" color="surface-variant">
        <v-container class="py-8">
          <v-btn
            variant="text"
            size="large"
            prepend-icon="mdi-arrow-left"
            @click="goBack"
          >
            Back to Fleet
          </v-btn>
        </v-container>
      </v-sheet>

      <v-container class="py-10">
        <v-row>
          <!-- Image Column -->
          <v-col cols="12" lg="6">
            <v-card elevation="2" class="detail-image-card">
              <v-img
                :src="rocket.image_url || '/placeholder-rocket.png'"
                aspect-ratio="4/3"
                cover
                class="rocket-detail-image"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-2"
                    />
                  </v-row>
                </template>
                <template #error>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                    style="background: #2a2a2a; min-height: 500px"
                  >
                    <div class="text-center">
                      <v-icon size="140" color="grey-darken-1">mdi-rocket-outline</v-icon>
                      <p class="text-body-2 mt-6 text-grey">Image not available</p>
                    </div>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>

          <!-- Info Column -->
          <v-col cols="12" lg="6">
            <div class="detail-content">
              <!-- Title -->
              <h1 class="detail-title mb-2">
                {{ rocket.full_name || rocket.name }}
              </h1>

              <!-- Meta -->
              <div class="detail-meta mb-8">
                <v-chip
                  v-if="rocket.manufacturer"
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="mr-2"
                >
                  <v-icon start size="16">mdi-factory</v-icon>
                  {{ rocket.manufacturer.name }}
                </v-chip>
                <v-chip
                  v-if="rocket.manufacturer?.country_code"
                  size="small"
                  variant="tonal"
                  color="secondary"
                >
                  <v-icon start size="16">mdi-flag</v-icon>
                  {{ rocket.manufacturer.country_code }}
                </v-chip>
              </div>

              <!-- Description -->
              <div class="mb-10">
                <h2 class="text-h6 mb-4">
                  <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                  Overview
                </h2>
                <p class="text-body-1 description-text">
                  {{ rocket.description || 'Technical specifications available upon request' }}
                </p>
              </div>

              <v-divider class="my-8" />

              <!-- Specifications Grid -->
              <div class="specs-grid">
                <h2 class="text-h6 mb-6">
                  <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
                  Technical Specifications
                </h2>

                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="spec-card">
                      <div class="spec-icon-wrapper" style="background: rgba(76, 175, 80, 0.1)">
                        <v-icon color="success" size="24">mdi-cash-multiple</v-icon>
                      </div>
                      <div class="spec-content">
                        <div class="spec-label">Launch Cost</div>
                        <div class="spec-value">
                          {{ rocket.launch_cost || 'Classified' }}
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <div class="spec-card">
                      <div class="spec-icon-wrapper" style="background: rgba(33, 150, 243, 0.1)">
                        <v-icon color="info" size="24">mdi-flag</v-icon>
                      </div>
                      <div class="spec-content">
                        <div class="spec-label">Country</div>
                        <div class="spec-value">
                          {{ rocket.manufacturer?.country_code || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <div class="spec-card">
                      <div class="spec-icon-wrapper" style="background: rgba(255, 152, 0, 0.1)">
                        <v-icon color="warning" size="24">mdi-calendar-star</v-icon>
                      </div>
                      <div class="spec-content">
                        <div class="spec-label">First Flight</div>
                        <div class="spec-value">
                          {{ formatDate(rocket.maiden_flight) }}
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <div class="spec-card">
                      <div class="spec-icon-wrapper" style="background: rgba(156, 39, 176, 0.1)">
                        <v-icon color="secondary" size="24">mdi-factory</v-icon>
                      </div>
                      <div class="spec-content">
                        <div class="spec-label">Manufacturer</div>
                        <div class="spec-value">
                          {{ rocket.manufacturer?.name || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import { useFormatters } from '@/composables/useFormatters'
import type { Rocket, NewRocket } from '@/types/rocket'

const router = useRouter()
const route = useRoute()
const store = useRocketStore()
const { formatDate } = useFormatters()

const rocket = ref<Rocket | NewRocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const rocketId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : 0
})

onMounted(async () => {
  await loadRocket()
})

async function loadRocket() {
  loading.value = true
  error.value = null

  try {
    const result = await store.fetchRocketById(rocketId.value)
    if (result) {
      rocket.value = result
    } else {
      error.value = 'Rocket not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load rocket data'
  } finally {
    loading.value = false
  }
}

function handleRetry() {
  loadRocket()
}

function goBack() {
  router.push('/rockets')
}
</script>

<style scoped>
.rocket-detail-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.detail-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.detail-image-card {
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.rocket-detail-image {
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
}

.detail-content {
  padding: 0 1rem;
}

.detail-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: rgb(var(--v-theme-on-background));
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.description-text {
  line-height: 1.8;
  color: rgba(var(--v-theme-on-background), 0.8);
}

.specs-grid {
  margin-top: 2rem;
}

.spec-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all 0.2s ease;
  height: 100%;
}

.spec-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.spec-icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spec-content {
  flex: 1;
  min-width: 0;
}

.spec-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spec-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  word-wrap: break-word;
}

@media (max-width: 1280px) {
  .detail-image-card {
    margin-bottom: 2rem;
  }
  
  .detail-content {
    padding: 0;
  }
}

@media (max-width: 960px) {
  .detail-title {
    font-size: 2.25rem;
  }
}

@media (max-width: 600px) {
  .detail-header {
    padding: 0.5rem 0;
  }

  .detail-title {
    font-size: 1.75rem;
  }

  .detail-content {
    padding: 0;
  }

  .description-text {
    font-size: 0.9375rem;
  }

  .spec-card {
    padding: 1rem;
  }

  .spec-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .spec-value {
    font-size: 1rem;
  }

  .spec-label {
    font-size: 0.75rem;
  }
}
</style>
