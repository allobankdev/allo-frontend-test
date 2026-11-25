
<template>
  <v-container class="py-8">
    <!-- Back Button -->
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-6"
      @click="router.push('/')"
    >
      Back to Rockets
    </v-btn>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />

      <p class="mt-4 text-medium-emphasis">
        Loading rocket details...
      </p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
      rounded="lg"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ errorMessage }}</span>

        <v-btn
          color="error"
          variant="text"
          @click="fetchRocket"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Rocket Detail -->
    <v-card
      v-else-if="rocket"
      rounded="lg"
      elevation="2"
      class="overflow-hidden"
    >
      <!-- Rocket Image -->
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        :alt="rocket.full_name"
        height="350"
        cover
        class="bg-grey-lighten-3"
      >
        <template #error>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon size="64" color="grey">
              mdi-rocket-launch
            </v-icon>
          </div>
        </template>
      </v-img>

      <div
        v-else
        class="d-flex align-center justify-center bg-grey-lighten-3"
        style="height: 250px"
      >
        <v-icon size="64" color="grey">
          mdi-rocket-launch
        </v-icon>
      </div>

      <!-- Rocket Information -->
      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ rocket.full_name }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-8">
          {{ rocket.description || 'No description available.' }}
        </p>

        <v-divider class="mb-6" />

        <h2 class="text-h6 font-weight-bold mb-4">
          Rocket Information
        </h2>

        <v-list density="comfortable">
          <v-list-item
            prepend-icon="mdi-currency-usd"
            title="Launch Cost"
            :subtitle="formatLaunchCost(rocket.launch_cost)"
          />

          <v-list-item
            prepend-icon="mdi-earth"
            title="Country"
            :subtitle="rocket.manufacturer?.country_code || 'Not available'"
          />

          <v-list-item
            prepend-icon="mdi-calendar"
            title="Maiden Flight"
            :subtitle="rocket.maiden_flight || 'Not available'"
          />
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <v-icon size="56" color="grey">
        mdi-rocket-launch-outline
      </v-icon>

      <h2 class="text-h6 mt-4">
        Rocket not found
      </h2>

      <p class="text-body-2 text-medium-emphasis mt-2">
        The requested rocket information is unavailable.
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRocketById } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()

const rocket = ref<Rocket | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function fetchRocket() {
  isLoading.value = true
  errorMessage.value = ''
  rocket.value = null

  try {
    // Safely read the dynamic route parameter
    const params = route.params as Record<string, unknown>
    const rawId = params['id']

    const rocketId = Array.isArray(rawId)
      ? rawId[0]
      : rawId

    if (typeof rocketId !== 'string' || !rocketId.trim()) {
      throw new Error('Rocket ID is missing')
    }

    rocket.value = await getRocketById(rocketId)
  } catch (error) {
    console.error('Failed to fetch rocket details:', error)

    errorMessage.value =
      'Failed to load rocket details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function formatLaunchCost(cost: string | number | null) {
  if (cost === null || cost === '') {
    return 'Not available'
  }

  if (typeof cost === 'number') {
    return `$${cost.toLocaleString('en-US')}`
  }

  return cost
}

onMounted(fetchRocket)
</script>
