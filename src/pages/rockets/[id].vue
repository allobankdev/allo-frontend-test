<template>
  <v-container
    class="py-8"
    max-width="1200"
  >
    <div class="mb-6">
      <v-btn
        to="/"
        variant="text"
        color="primary"
        prepend-icon="mdi-arrow-left"
        rounded="lg"
        class="text-none px-2"
      >
        Back to rockets
      </v-btn>
    </div>

    <!-- Loading State -->
    <v-row v-if="state.detailStatus === 'loading'">
      <v-col
        cols="12"
        md="5"
      >
        <v-skeleton-loader
          type="image"
          height="400"
          class="rounded-xl"
        />
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
        <v-skeleton-loader type="heading, paragraph, paragraph" />
      </v-col>
    </v-row>

    <!-- Not Found State -->
    <EmptyState
      v-else-if="state.detailStatus === 'error' && state.detailNotFound"
      heading-tag="h1"
      title="Rocket not found"
      :description="state.detailError || 'The requested rocket does not exist.'"
      action-label="Back to rockets"
      action-to="/"
    />

    <!-- Error / Retry State -->
    <ErrorAlert
      v-else-if="state.detailStatus === 'error'"
      title="Could not load rocket details"
      :message="state.detailError"
      @retry="void loadRocketById(rocketId, true)"
    />

    <!-- Success Detail View -->
    <v-row
      v-else-if="state.selectedRocket"
      class="ga-y-6"
    >
      <v-col
        cols="12"
        md="5"
      >
        <v-card
          color="surface"
          rounded="xl"
          class="detail-image-card overflow-hidden"
        >
          <RocketImage
            :src="state.selectedRocket.imageUrl"
            :alt="state.selectedRocket.fullName"
            height="clamp(240px, 42vw, 420px)"
          />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="7"
        class="pl-md-8"
      >
        <div class="d-flex flex-wrap align-center ga-3 mb-4">
          <h1 class="text-h4 font-weight-bold">
            {{ state.selectedRocket.fullName }}
          </h1>
          <v-chip
            v-if="state.selectedRocket.isCustom"
            size="small"
            color="primary"
            variant="tonal"
          >
            Custom
          </v-chip>
        </div>

        <p class="text-body-1 text-medium-emphasis mb-8 detail-description">
          {{ formatDescription(state.selectedRocket.description) }}
        </p>

        <v-row>
          <v-col
            v-for="spec in rocketSpecs"
            :key="spec.label"
            cols="12"
            sm="4"
          >
            <v-card
              color="surface"
              rounded="xl"
              class="pa-4 spec-card h-100"
            >
              <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-2">
                <v-icon
                  :icon="spec.icon"
                  size="16"
                  color="primary"
                />
                <span>{{ spec.label }}</span>
              </div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ spec.value }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import RocketImage from '@/components/RocketImage.vue'
import { APP_TITLE } from '@/constants/app'
import { useRocketStore } from '@/stores/rockets'
import {
  formatCountry,
  formatDescription,
  formatLaunchCost,
  formatMaidenFlight,
} from '@/utils/formatters'

const route = useRoute()
const { state, loadRocketById } = useRocketStore()

const rocketId = computed(() => {
  const params = route.params as { id?: string | string[] }
  return Array.isArray(params.id) ? params.id[0] ?? '' : params.id ?? ''
})

const rocketSpecs = computed(() => {
  const rocket = state.selectedRocket
  if (!rocket) return []

  return [
    {
      label: 'Cost per launch',
      value: formatLaunchCost(rocket.launchCost),
      icon: 'mdi-cash',
    },
    {
      label: 'Country',
      value: formatCountry(rocket.countryCode),
      icon: 'mdi-earth',
    },
    {
      label: 'First flight',
      value: formatMaidenFlight(rocket.maidenFlight),
      icon: 'mdi-calendar-blank-outline',
    },
  ]
})

watchEffect(() => {
  if (state.selectedRocket && state.detailStatus === 'success') {
    document.title = `${state.selectedRocket.fullName} — ${APP_TITLE}`
  } else {
    document.title = APP_TITLE
  }
})

onMounted(() => {
  if (rocketId.value) {
    void loadRocketById(rocketId.value)
  }
})

onUnmounted(() => {
  document.title = APP_TITLE
})

watch(rocketId, (nextId) => {
  if (nextId) {
    void loadRocketById(nextId)
  }
})
</script>

<style scoped>
.detail-image-card,
.spec-card {
  border: 1px solid var(--app-border);
}

.detail-description {
  line-height: 1.65;
}
</style>
