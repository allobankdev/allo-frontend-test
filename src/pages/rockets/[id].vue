<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getRocketById } from '../../api/rockets'
import type { Rocket } from '../../types/rocket'
import { useRocketStore } from '../../stores/rockets'

const route = useRoute()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const rocketStore = useRocketStore()

let requestId = 0

async function fetchRocket() {
  const currentRequest = ++requestId
  const id = String(route.params.id ?? '')

  loading.value = true
  error.value = null
  rocket.value = null

  try {
    if (!id) {
      throw new Error('Rocket ID is missing')
    }

    const localRocket = rocketStore.findLocalRocket(id)

    if (localRocket) {
      if (currentRequest === requestId) {
        rocket.value = localRocket
      }
      return
    }

    if (id.startsWith('local-')) {
      throw new Error('Local rocket not found. It may have been lost after a page refresh.')
    }

    const result = await getRocketById(id)

    if (currentRequest === requestId) {
      rocket.value = result
    }
  } catch (err) {
    if (currentRequest === requestId) {
      error.value = err instanceof Error
        ? err.message
        : 'Failed to load rocket details'
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false
    }
  }
}

function formatCost(value: Rocket['launch_cost']) {
  if (value == null || String(value).trim() === '') {
    return 'Not available'
  }

  const cost = Number(value)

  if (!Number.isFinite(cost)) {
    return String(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
}

function formatDate(value: Rocket['maiden_flight']) {
  if (!value) return 'Not available'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

watch(() => route.params.id, fetchRocket, {
  immediate: true,
})
</script>

<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/"
      class="mb-6"
    >
      Back to Rockets
    </v-btn>

    <!-- Loading state -->
    <v-row v-if="loading">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image" />
      </v-col>

      <v-col cols="12" md="6">
        <v-skeleton-loader
          type="heading, paragraph, paragraph"
        />
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      <div class="text-h6 mb-2">
        Unable to load rocket
      </div>

      <p class="mb-4">{{ error }}</p>

      <v-btn
        color="error"
        variant="outlined"
        prepend-icon="mdi-refresh"
        @click="fetchRocket"
      >
        Retry
      </v-btn>
    </v-alert>

    <!-- Success state -->
    <v-row v-else-if="rocket" align="start">
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="2">
          <v-img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            height="420"
            cover
          >
            <template #error>
              <div class="image-placeholder">
                <v-icon
                  icon="mdi-rocket"
                  size="90"
                />
                <p>Image unavailable</p>
              </div>
            </template>
          </v-img>

          <div v-else class="image-placeholder">
            <v-icon icon="mdi-rocket" size="90" />
            <p>Image unavailable</p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ rocket.full_name || 'Unnamed Rocket' }}
        </h1>

        <p class="text-body-1 mb-6 description">
          {{
            rocket.description ||
            'No description available for this rocket.'
          }}
        </p>

        <v-card
          rounded="lg"
          variant="outlined"
        >
          <v-card-title>
            Rocket Information
          </v-card-title>

          <v-divider />

          <v-list lines="two">
            <v-list-item
              prepend-icon="mdi-cash"
              title="Cost per Launch"
              :subtitle="formatCost(rocket.launch_cost)"
            />

            <v-divider inset />

            <v-list-item
              prepend-icon="mdi-earth"
              title="Country"
              :subtitle="
                rocket.manufacturer?.country_code ||
                'Not available'
              "
            />

            <v-divider inset />

            <v-list-item
              prepend-icon="mdi-calendar"
              title="First Flight"
              :subtitle="formatDate(rocket.maiden_flight)"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.image-placeholder {
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #e9edf3;
  color: #64748b;
}

.description {
  white-space: pre-line;
  line-height: 1.8;
}
</style>
