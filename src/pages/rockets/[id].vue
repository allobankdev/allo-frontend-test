<template>
  <v-container class="page-container py-8">
    <div class="mb-6">
      <v-btn
        color="primary"
        prepend-icon="mdi-arrow-left"
        to="/"
        variant="tonal"
      >
        Back to rockets
      </v-btn>
    </div>

    <LoadingState
      v-if="detailStatus === 'loading' || detailStatus === 'idle'"
      label="Loading rocket..."
    />

    <ErrorState
      v-else-if="detailStatus === 'error'"
      :message="detailError ?? 'Something went wrong. Please try again.'"
      :retryable="detailError !== ROCKET_NOT_FOUND_MESSAGE"
      @retry="rocketStore.loadRocketDetail(rocketId)"
    />

    <v-card
      v-else-if="detailStatus === 'success' && selectedRocket && selectedRocket.id === rocketId"
      class="rounded-xl overflow-hidden"
      elevation="3"
    >
      <div class="detail-hero-wrapper">
        <RocketImage
          :alt="selectedRocket.name"
          :height="320"
          :src="selectedRocket.imageUrl"
        />
        <div class="detail-hero-gradient" />
      </div>

      <v-card-text class="pa-6 pa-sm-8">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <h1 class="rocket-detail-title text-h4 text-sm-h3 font-weight-bold">
            {{ selectedRocket.name }}
          </h1>
          <v-chip
            v-if="selectedRocket.isLocal"
            color="primary"
            size="small"
            variant="tonal"
          >
            Local
          </v-chip>
        </div>

        <p class="rocket-detail-description text-body-1 mb-6">
          {{ formatText(selectedRocket.description, 'No description available.') }}
        </p>

        <v-divider class="mb-6" />

        <dl class="rocket-facts-grid">
          <v-sheet
            class="rocket-fact-card rounded-lg pa-4 d-flex align-center ga-4"
            color="surface-light"
          >
            <v-avatar
              color="primary"
              size="44"
              variant="tonal"
            >
              <v-icon icon="mdi-currency-usd" />
            </v-avatar>
            <div>
              <dt class="text-caption text-medium-emphasis">
                Launch cost
              </dt>
              <dd class="text-body-1 font-weight-bold">
                {{ formatLaunchCost(selectedRocket.launchCost) }}
              </dd>
            </div>
          </v-sheet>

          <v-sheet
            class="rocket-fact-card rounded-lg pa-4 d-flex align-center ga-4"
            color="surface-light"
          >
            <v-avatar
              color="secondary"
              size="44"
              variant="tonal"
            >
              <v-icon icon="mdi-flag" />
            </v-avatar>
            <div>
              <dt class="text-caption text-medium-emphasis">
                Country
              </dt>
              <dd class="text-body-1 font-weight-bold">
                {{ formatText(selectedRocket.country) }}
              </dd>
            </div>
          </v-sheet>

          <v-sheet
            class="rocket-fact-card rounded-lg pa-4 d-flex align-center ga-4"
            color="surface-light"
          >
            <v-avatar
              color="info"
              size="44"
              variant="tonal"
            >
              <v-icon icon="mdi-calendar" />
            </v-avatar>
            <div>
              <dt class="text-caption text-medium-emphasis">
                First flight
              </dt>
              <dd class="text-body-1 font-weight-bold">
                {{ formatMaidenFlight(selectedRocket.maidenFlight) }}
              </dd>
            </div>
          </v-sheet>
        </dl>

        <v-alert
          v-if="selectedRocket.isLocal"
          class="mt-6 rounded-lg"
          type="info"
          variant="tonal"
        >
          This rocket was added locally and will be lost when you reload the page.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router/auto'
import { storeToRefs } from 'pinia'
import { ROCKET_NOT_FOUND_MESSAGE } from '@/api/rocketApi'
import { useRocketStore } from '@/stores/rocketStore'
import {
  formatLaunchCost,
  formatMaidenFlight,
  formatText,
} from '@/utils/format'

const route = useRoute('/rockets/[id]')
const rocketStore = useRocketStore()
const { detailError, detailStatus, selectedRocket } = storeToRefs(rocketStore)

const rocketId = computed<string>(() => {
  const rawId: string | string[] = route.params.id
  return Array.isArray(rawId) ? (rawId[0] ?? '') : rawId
})

watch(
  rocketId,
  id => {
    void rocketStore.loadRocketDetail(id)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  rocketStore.cancelDetailLoad()
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
}

.detail-hero-wrapper {
  position: relative;
}

.detail-hero-gradient {
  position: absolute;
  inset: auto 0 0 0;
  height: 96px;
  background: linear-gradient(to top, rgba(11, 16, 32, 0.7), transparent);
  pointer-events: none;
}

.rocket-detail-title {
  overflow-wrap: anywhere;
}

.rocket-detail-description {
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.rocket-facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 960px) {
  .rocket-facts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
