<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRocketById } from '@/services/rocketService'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fallbackImage = 'https://placehold.co/900x500?text=Rocket+Image'

const rocketId = computed(() => String(route.params.id))

function formatValue(value?: string | number | null) {
  return value || 'Not available'
}

function formatLaunchCost(value?: string | number | null) {
  if (!value) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function formatDate(value?: string | null) {
  if (!value) return 'Not available'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

async function loadRocket() {
  loading.value = true
  error.value = null

  try {
    if (rocketId.value.startsWith('local-')) {
      const localRocket = rocketStore.getLocalRocketById(rocketId.value)

      if (!localRocket) {
        throw new Error('Local rocket not found')
      }

      rocket.value = localRocket
      return
    }

    rocket.value = await getRocketById(rocketId.value)
  } catch {
    error.value = 'Failed to load rocket detail. Please try again.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(loadRocket)
</script>

<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Back to rockets
    </v-btn>

    <LoadingState v-if="loading" />

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="loadRocket"
    />

    <v-card
      v-else-if="rocket"
      rounded="lg"
    >
      <v-img
        :src="rocket.image_url || fallbackImage"
        :alt="rocket.full_name"
        height="420"
        cover
      />

      <v-card-text class="pa-6">
        <p class="text-overline text-primary mb-2">
          Rocket Detail
        </p>

        <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
          {{ rocket.full_name }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description || 'No description available.' }}
        </p>

        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-sheet
              border
              rounded="lg"
              class="pa-4 h-100"
            >
              <p class="text-caption text-medium-emphasis mb-1">
                Launch Cost
              </p>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ formatLaunchCost(rocket.launch_cost) }}
              </p>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-sheet
              border
              rounded="lg"
              class="pa-4 h-100"
            >
              <p class="text-caption text-medium-emphasis mb-1">
                Country
              </p>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ formatValue(rocket.manufacturer?.country_code) }}
              </p>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-sheet
              border
              rounded="lg"
              class="pa-4 h-100"
            >
              <p class="text-caption text-medium-emphasis mb-1">
                First Flight
              </p>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ formatDate(rocket.maiden_flight) }}
              </p>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-sheet
              border
              rounded="lg"
              class="pa-4 h-100"
            >
              <p class="text-caption text-medium-emphasis mb-1">
                Rocket ID
              </p>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ rocket.id }}
              </p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>