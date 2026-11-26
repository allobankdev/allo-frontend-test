<template>
  <v-container class="page-container py-8">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">
      Back to rockets
    </v-btn>

    <LoadingState v-if="isInitialLoading" message="Loading rocket details..." />

    <ErrorState
      v-else-if="error && !rocket"
      title="Could not load this rocket"
      :message="error"
      @retry="load(true)"
    />

    <template v-else-if="rocket">
      <v-alert
        v-if="error"
        type="warning"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="store.clearDetailError()"
      >
        {{ error }}
        <template #append>
          <v-btn variant="text" size="small" @click="load(true)">Retry</v-btn>
        </template>
      </v-alert>

      <v-progress-linear v-if="store.detailLoading" indeterminate color="primary" class="mb-4" />

      <v-card class="overflow-hidden" variant="flat">
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <div class="detail-media">
              <v-img
                v-if="showImage"
                :src="rocket.image_url ?? undefined"
                :alt="displayName"
                height="100%"
                class="detail-image"
                cover
                @error="imageFailed = true"
              >
                <template #placeholder>
                  <div class="detail-placeholder">
                    <v-progress-circular indeterminate color="primary" size="36" />
                  </div>
                </template>
              </v-img>

              <div v-else class="detail-placeholder">
                <v-icon icon="mdi-rocket-launch-outline" size="72" />
                <span class="text-body-2 text-medium-emphasis">No image available</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="7">
            <v-card-text class="pa-6 pa-md-8">
              <div class="d-flex flex-wrap align-center ga-2 mb-3">
                <v-chip v-if="rocket.isLocal" color="secondary" size="small">Added by you</v-chip>
                <v-chip v-if="country" color="primary" size="small" variant="tonal">
                  {{ country }}
                </v-chip>
              </div>

              <h1 class="text-h4 font-weight-bold mb-3">{{ displayName }}</h1>
              <p class="text-body-1 text-medium-emphasis detail-description">{{ description }}</p>

              <v-divider class="my-6" />

              <h2 class="text-subtitle-1 font-weight-bold mb-4">Rocket details</h2>

              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="detail-stat">
                    <v-icon icon="mdi-cash" size="20" color="primary" class="mb-2" />
                    <span class="detail-stat__label">Cost per launch</span>
                    <span class="detail-stat__value">{{ formattedCost }}</span>
                  </div>
                </v-col>

                <v-col cols="12" sm="4">
                  <div class="detail-stat">
                    <v-icon
                      icon="mdi-map-marker-outline"
                      size="20"
                      color="primary"
                      class="mb-2"
                    />
                    <span class="detail-stat__label">Country</span>
                    <span class="detail-stat__value">{{ country || 'Not available' }}</span>
                  </div>
                </v-col>

                <v-col cols="12" sm="4">
                  <div class="detail-stat">
                    <v-icon
                      icon="mdi-calendar-clock-outline"
                      size="20"
                      color="primary"
                      class="mb-2"
                    />
                    <span class="detail-stat__label">First flight</span>
                    <span class="detail-stat__value">{{ formattedMaidenFlight }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </template>

    <v-card v-else class="state-panel text-center pa-10" variant="flat">
      <v-icon icon="mdi-rocket-launch-outline" size="56" color="primary" class="mb-4" />
      <h2 class="text-h6 mb-2">Rocket not found</h2>
      <p class="text-body-2 text-medium-emphasis mb-6">
        We could not find a rocket with this identifier.
      </p>
      <v-btn color="primary" to="/" prepend-icon="mdi-arrow-left">Back to rockets</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useRocketStore } from '@/stores/rocketStore'

const route = useRoute()
const store = useRocketStore()

const imageFailed = ref(false)

const id = computed(() => String(route.params.id ?? ''))
const rocket = computed(() => store.findRocket(id.value))
const error = computed(() => store.detailError)
const isInitialLoading = computed(() => store.detailLoading && !rocket.value)

const displayName = computed(
  () => rocket.value?.full_name || rocket.value?.name || 'Unnamed rocket',
)

const description = computed(
  () => rocket.value?.description?.trim() || 'No description available for this rocket yet.',
)

const country = computed(() => rocket.value?.manufacturer?.country_code?.trim() || '')

const formattedCost = computed(() => {
  const raw = rocket.value?.launch_cost
  if (raw === null || raw === undefined || raw === '') return 'Not available'

  const amount = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(amount)) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
})

const formattedMaidenFlight = computed(() => {
  const raw = rocket.value?.maiden_flight
  if (!raw) return 'Not available'

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
})

const showImage = computed(() => Boolean(rocket.value?.image_url) && !imageFailed.value)

async function load(force = false) {
  if (!id.value) return
  await store.fetchRocketById(id.value, force)
}

watch(
  () => rocket.value?.image_url,
  () => {
    imageFailed.value = false
  },
)

watch(id, () => {
  imageFailed.value = false
  load()
})

onMounted(() => {
  load()
})
</script>

<style scoped>
.detail-media {
  height: 100%;
  min-height: 320px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.18),
    rgba(var(--v-theme-surface-variant), 0.6)
  );
}

.detail-image {
  min-height: 320px;
}

.detail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 320px;
  height: 100%;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.detail-description {
  white-space: pre-line;
  line-height: 1.7;
}

.detail-stat {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.35);
}

.detail-stat__label {
  margin-bottom: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.65);
}

.detail-stat__value {
  overflow-wrap: anywhere;
  font-size: 1rem;
  font-weight: 600;
}
</style>
