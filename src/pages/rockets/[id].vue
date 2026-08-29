<template>
  <v-container
    fluid
    class="pa-4 pa-md-6"
  >
    <!-- Back Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/"
          color="primary"
        >
          Back to Rockets
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <LoadingState
      v-if="loading"
      message="Loading rocket details..."
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="loadRocket"
    />

    <!-- Rocket Details -->
    <template v-else-if="rocket">
      <v-row>
        <!-- Image Section -->
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            rounded="lg"
            class="overflow-hidden"
          >
            <v-carousel
              v-if="rocket.flickr_images?.length"
              height="400"
              show-arrows="hover"
              hide-delimiter-background
            >
              <v-carousel-item
                v-for="(image, index) in rocket.flickr_images"
                :key="index"
                :src="image"
                cover
              />
            </v-carousel>
            <v-img
              v-else
              src="https://via.placeholder.com/600x400?text=No+Image+Available"
              height="400"
              cover
            />
          </v-card>
        </v-col>

        <!-- Info Section -->
        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-center mb-4">
            <h1 class="text-h3 font-weight-bold">
              {{ rocket.name }}
            </h1>
            <v-chip
              class="ml-4"
              :color="rocket.active ? 'success' : 'grey'"
              variant="tonal"
            >
              {{ rocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>

          <p class="text-body-1 mb-6">
            {{ rocket.description }}
          </p>

          <v-divider class="mb-6" />

          <!-- Key Details -->
          <v-row>
            <v-col cols="6">
              <div class="detail-item">
                <v-icon
                  color="primary"
                  class="mb-1"
                >
                  mdi-currency-usd
                </v-icon>
                <div class="text-caption text-medium-emphasis">
                  Cost per Launch
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ formatCurrency(rocket.cost_per_launch) }}
                </div>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="detail-item">
                <v-icon
                  color="primary"
                  class="mb-1"
                >
                  mdi-earth
                </v-icon>
                <div class="text-caption text-medium-emphasis">
                  Country
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ rocket.country }}
                </div>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="detail-item">
                <v-icon
                  color="primary"
                  class="mb-1"
                >
                  mdi-calendar
                </v-icon>
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ formatDate(rocket.first_flight) }}
                </div>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="detail-item">
                <v-icon
                  color="primary"
                  class="mb-1"
                >
                  mdi-chart-line
                </v-icon>
                <div class="text-caption text-medium-emphasis">
                  Success Rate
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ rocket.success_rate_pct }}%
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <!-- Specifications -->
          <h3 class="text-h6 font-weight-bold mb-4">
            Specifications
          </h3>
          <v-row>
            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Height
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ rocket.height?.meters || 0 }} m
                </div>
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Diameter
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ rocket.diameter?.meters || 0 }} m
                </div>
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Mass
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatNumber(rocket.mass?.kg || 0) }} kg
                </div>
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Stages
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ rocket.stages || 0 }}
                </div>
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Boosters
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ rocket.boosters || 0 }}
                </div>
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <div class="spec-item">
                <div class="text-caption text-medium-emphasis">
                  Company
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ rocket.company || 'N/A' }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Wikipedia Link -->
          <v-btn
            v-if="rocket.wikipedia"
            class="mt-6"
            variant="outlined"
            color="primary"
            :href="rocket.wikipedia"
            target="_blank"
            prepend-icon="mdi-wikipedia"
          >
            Learn more on Wikipedia
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketsStore, type Rocket } from '@/stores/rockets'

const route = useRoute()
const rocketsStore = useRocketsStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

async function loadRocket() {
  const id = route.params.id as string
  loading.value = true
  error.value = null

  try {
    rocket.value = await rocketsStore.fetchRocketById(id)
    if (!rocket.value) {
      error.value = 'Rocket not found'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load rocket'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRocket()
})
</script>

<style scoped>
.detail-item,
.spec-item {
  padding: 8px 0;
}
</style>
