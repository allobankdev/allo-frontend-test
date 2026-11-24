<template>
  <v-container class="py-6">
    <div class="mb-4">
      <v-btn
        prepend-icon="mdi-arrow-left"
        to="/"
        variant="text"
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
      @retry="rocketStore.loadRocketDetail(rocketId)"
    />

    <v-card
      v-else-if="detailStatus === 'success' && selectedRocket && selectedRocket.id === rocketId"
    >
      <RocketImage
        :alt="selectedRocket.name"
        :height="320"
        :src="selectedRocket.imageUrl"
      />

      <v-card-text class="pa-6">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <h1 class="text-h4 font-weight-bold">
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
          <div class="rocket-fact-item">
            <dt class="text-caption text-medium-emphasis">
              Launch cost
            </dt>
            <dd class="text-body-1 font-weight-medium">
              {{ formatLaunchCost(selectedRocket.launchCost) }}
            </dd>
          </div>

          <div class="rocket-fact-item">
            <dt class="text-caption text-medium-emphasis">
              Country
            </dt>
            <dd class="text-body-1 font-weight-medium">
              {{ formatText(selectedRocket.country) }}
            </dd>
          </div>

          <div class="rocket-fact-item">
            <dt class="text-caption text-medium-emphasis">
              First flight
            </dt>
            <dd class="text-body-1 font-weight-medium">
              {{ formatMaidenFlight(selectedRocket.maidenFlight) }}
            </dd>
          </div>
        </dl>

        <v-alert
          v-if="selectedRocket.isLocal"
          class="mt-6"
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
.rocket-detail-description {
  white-space: pre-line;
}

.rocket-facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .rocket-facts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
