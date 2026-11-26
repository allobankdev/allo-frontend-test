<template>
  <v-container
    class="py-6 py-md-10 px-4"
    max-width="1200"
  >
    <div class="mb-6">
      <v-btn
        color="primary"
        prepend-icon="mdi-arrow-left"
        rounded="lg"
        to="/"
        variant="text"
      >
        Back to Rockets
      </v-btn>
    </div>

    <v-card
      v-if="showLoading"
      border
      class="detail-card overflow-hidden"
      color="#0f172a"
      rounded="xl"
      variant="flat"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="5"
        >
          <v-skeleton-loader
            class="fill-height"
            color="#0f172a"
            height="320"
            type="image"
          />
        </v-col>
        <v-col
          cols="12"
          md="7"
        >
          <v-skeleton-loader
            color="#0f172a"
            type="article"
          />
          <div class="px-6 pb-8">
            <v-row>
              <v-col
                v-for="item in 3"
                :key="item"
                cols="12"
                sm="4"
              >
                <v-skeleton-loader
                  color="#0b1120"
                  rounded="lg"
                  type="list-item-two-line"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <div v-else-if="showNotFound">
      <EmptyState
        description="Rocket yang diminta tidak ditemukan atau mungkin sudah tidak tersedia."
        icon="mdi-rocket-off-outline"
        title="Rocket Not Found"
      />

      <div class="d-flex justify-center mt-6">
        <v-btn
          color="primary"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          to="/"
          variant="flat"
        >
          Back to Rockets
        </v-btn>
      </div>
    </div>

    <v-alert
      v-else-if="showError"
      border="start"
      color="error"
      rounded="xl"
      variant="tonal"
    >
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <div class="text-subtitle-1 font-weight-bold mb-1">
            Failed to load rocket details
          </div>
          <div class="text-body-2">
            {{ rocketStore.detailError }}
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn
            color="error"
            :loading="rocketStore.isDetailLoading"
            prepend-icon="mdi-refresh"
            rounded="lg"
            variant="flat"
            @click="handleRetry"
          >
            Retry
          </v-btn>
        </div>
      </div>
    </v-alert>

    <v-card
      v-else-if="rocket"
      border
      class="detail-card overflow-hidden"
      color="#0f172a"
      rounded="xl"
      variant="flat"
    >
      <v-row no-gutters>
        <v-col
          class="detail-media-col d-flex"
          cols="12"
          md="5"
        >
          <RocketImage
            :alt="rocketName"
            aspect-ratio="16 / 9"
            class="detail-image flex-grow-1"
            :src="rocket.image_url"
          />
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <div class="pa-5 pa-sm-6 pa-md-8 d-flex flex-column fill-height">
            <div class="d-flex flex-wrap align-center ga-2 mb-4">
              <v-chip
                :color="rocket.id < 0 ? 'secondary' : 'primary'"
                :prepend-icon="rocket.id < 0 ? 'mdi-star-outline' : 'mdi-rocket-launch-outline'"
                size="small"
                variant="tonal"
              >
                {{ rocket.id < 0 ? 'Custom Rocket' : 'SpaceX Launch Vehicle' }}
              </v-chip>

              <v-chip
                color="default"
                size="small"
                variant="outlined"
              >
                ID #{{ rocket.id }}
              </v-chip>
            </div>

            <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-4">
              {{ rocketName }}
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-6 mb-md-8 detail-description">
              {{ rocketDescription }}
            </p>

            <v-divider class="mb-6 mt-auto" />

            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="spec-card pa-4 pa-md-5 fill-height"
                  color="#0b1120"
                  rounded="lg"
                >
                  <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-2">
                    <v-icon
                      color="primary"
                      icon="mdi-currency-usd"
                      size="18"
                    />
                    <span>Cost Per Launch</span>
                  </div>
                  <div class="text-subtitle-1 text-md-h6 font-weight-bold text-white">
                    {{ formattedLaunchCost }}
                  </div>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="spec-card pa-4 pa-md-5 fill-height"
                  color="#0b1120"
                  rounded="lg"
                >
                  <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-2">
                    <v-icon
                      color="primary"
                      icon="mdi-earth"
                      size="18"
                    />
                    <span>Country</span>
                  </div>
                  <div class="text-subtitle-1 text-md-h6 font-weight-bold text-white">
                    {{ formattedCountry }}
                  </div>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-sheet
                  border
                  class="spec-card pa-4 pa-md-5 fill-height"
                  color="#0b1120"
                  rounded="lg"
                >
                  <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-2">
                    <v-icon
                      color="primary"
                      icon="mdi-calendar-outline"
                      size="18"
                    />
                    <span>First Flight</span>
                  </div>
                  <div class="text-subtitle-1 text-md-h6 font-weight-bold text-white">
                    {{ formattedFirstFlight }}
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
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import {
  formatCountry,
  formatDescription,
  formatFirstFlight,
  formatLaunchCost,
  formatRocketName,
} from '@/utils/rocketFormatter'

const route = useRoute('/rockets/[id]')
const rocketStore = useRocketStore()

const rawId = computed(() => {
  const param = route.params.id
  return Array.isArray(param) ? String(param[0] ?? '') : String(param ?? '')
})

const parsedId = computed<number | null>(() => {
  const trimmed = rawId.value.trim()
  if (trimmed.length === 0) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isInteger(parsed) ? parsed : null
})

const rocket = computed(() => {
  if (parsedId.value === null) {
    return undefined
  }

  return rocketStore.findRocketById(parsedId.value)
})

function isNotFoundErrorMessage(message: string | null): boolean {
  if (!message) {
    return false
  }

  const normalized = message.toLowerCase()
  return (
    normalized.includes('not found')
    || normalized.includes('404')
    || normalized.includes('invalid rocket id')
  )
}

const showLoading = computed(() => rocketStore.isDetailLoading && !rocket.value)

const showNotFound = computed(() => {
  if (showLoading.value || rocket.value) {
    return false
  }

  if (parsedId.value === null || parsedId.value <= 0) {
    return true
  }

  return isNotFoundErrorMessage(rocketStore.detailError)
})

const showError = computed(() => {
  if (showLoading.value || rocket.value || showNotFound.value) {
    return false
  }

  return Boolean(rocketStore.detailError)
})

const rocketName = computed(() => formatRocketName(rocket.value?.full_name))
const rocketDescription = computed(() => formatDescription(rocket.value?.description))
const formattedLaunchCost = computed(() => formatLaunchCost(rocket.value?.launch_cost))
const formattedCountry = computed(() => formatCountry(rocket.value?.manufacturer))
const formattedFirstFlight = computed(() => formatFirstFlight(rocket.value?.maiden_flight))

async function loadRocketDetail(): Promise<void> {
  if (parsedId.value === null) {
    return
  }

  await rocketStore.loadRocketById(parsedId.value)
}

function handleRetry(): void {
  void loadRocketDetail()
}

onMounted(() => {
  void loadRocketDetail()
})

watch(rawId, (newId, oldId) => {
  if (newId !== oldId) {
    void loadRocketDetail()
  }
})
</script>

<style scoped>
.detail-card {
  border-color: rgba(148, 163, 184, 0.16) !important;
}

.detail-media-col {
  background-color: #1e2430;
}

.detail-image {
  width: 100%;
  min-height: 240px;
}

@media (min-width: 960px) {
  .detail-image {
    min-height: 100%;
  }
}

.spec-card {
  border-color: rgba(148, 163, 184, 0.14) !important;
}

.detail-description {
  line-height: 1.7;
}
</style>
