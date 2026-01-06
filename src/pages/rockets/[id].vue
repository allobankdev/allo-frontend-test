<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRockets } from '@/composables'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rockets = useRockets()

const rocketId = computed(() => route.params.id as string)

const rocket = computed(() => rockets.currentRocket.value)

const formattedCost = computed(() => {
  if (!rocket.value) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(rocket.value.cost_per_launch)
})

const formattedDate = computed(() => {
  if (!rocket.value?.first_flight) return ''
  return new Date(rocket.value.first_flight).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

onMounted(() => {
  rockets.fetchRocketById(rocketId.value)
})

onUnmounted(() => {
  rockets.clearCurrentRocket()
})

function handleRetry() {
  rockets.fetchRocketById(rocketId.value)
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <v-container
    fluid
    class="pa-4 pa-md-6"
  >
    <div class="back-button-wrapper">
      <v-btn
        variant="tonal"
        class="back-button"
        @click="goBack"
      >
        <v-icon
          icon="mdi-arrow-left"
          start
        />
        Back to Rockets
      </v-btn>
    </div>

    <LoadingState
      v-if="rockets.isLoading.value"
      message="Loading rocket details..."
    />

    <ErrorState
      v-else-if="rockets.hasError.value"
      :type="rockets.errorType.value"
      :message="rockets.error.value || undefined"
      @retry="handleRetry"
    />

    <template v-else-if="rocket">
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-carousel
            v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
            height="400"
            show-arrows="hover"
            cycle
            hide-delimiter-background
          >
            <v-carousel-item
              v-for="(image, index) in rocket.flickr_images"
              :key="index"
              :src="image"
              cover
            />
          </v-carousel>
          <div
            v-else
            class="no-image-placeholder"
          >
            <v-icon
              icon="mdi-image-off"
              size="64"
              color="grey"
            />
            <span class="text-body-1 text-grey mt-3">No Image Available</span>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-center mb-4">
            <h1 class="text-h3 font-weight-bold mr-3">
              {{ rocket.name }}
            </h1>
            <v-chip
              :color="rocket.active ? 'success' : 'error'"
              variant="tonal"
            >
              {{ rocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>

          <p class="text-body-1 mb-6">
            {{ rocket.description }}
          </p>

          <v-divider class="mb-4" />

          <v-list
            class="bg-transparent"
            density="comfortable"
          >
            <v-list-item>
              <template #prepend>
                <v-icon
                  icon="mdi-currency-usd"
                  color="success"
                />
              </template>
              <v-list-item-title class="font-weight-medium">
                Cost Per Launch
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ formattedCost }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon
                  icon="mdi-flag"
                  color="primary"
                />
              </template>
              <v-list-item-title class="font-weight-medium">
                Country
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ rocket.country }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon
                  icon="mdi-calendar"
                  color="info"
                />
              </template>
              <v-list-item-title class="font-weight-medium">
                First Flight
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ formattedDate }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="rocket.company">
              <template #prepend>
                <v-icon
                  icon="mdi-domain"
                  color="warning"
                />
              </template>
              <v-list-item-title class="font-weight-medium">
                Company
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ rocket.company }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="rocket.success_rate_pct">
              <template #prepend>
                <v-icon
                  icon="mdi-chart-line"
                  color="success"
                />
              </template>
              <v-list-item-title class="font-weight-medium">
                Success Rate
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ rocket.success_rate_pct }}%
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4" />

          <h3 class="text-h6 mb-3">
            Technical Specifications
          </h3>

          <v-row dense>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.height?.meters || 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Height (m)
                </div>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.diameter?.meters || 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Diameter (m)
                </div>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.mass?.kg ? `${(rocket.mass.kg / 1000).toFixed(0)}t` : 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Mass
                </div>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.stages || 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Stages
                </div>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.engines?.number || 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Engines
                </div>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 text-center"
              >
                <div class="text-h6 font-weight-bold">
                  {{ rocket.boosters || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Boosters
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-btn
            v-if="rocket.wikipedia"
            :href="rocket.wikipedia"
            target="_blank"
            color="primary"
            variant="outlined"
            class="mt-6"
          >
            <v-icon
              icon="mdi-wikipedia"
              start
            />
            Read More on Wikipedia
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped>
.back-button-wrapper {
  margin-bottom: 16px;
}

.no-image-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 8px;
}

@media (max-width: 960px) {
  .back-button-wrapper {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgb(var(--v-theme-background));
    margin: -16px -16px 16px -16px;
    padding: 12px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .back-button {
    width: 100%;
  }
}
</style>
