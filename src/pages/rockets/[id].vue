<template>
  <v-container>
    <v-btn
      icon="mdi-arrow-left"
      variant="text"
      aria-label="Go back"
      class="mb-4"
      @click="router.back()"
    />

    <div
      v-if="loading"
      class="d-flex justify-center align-center"
      style="min-height: 400px;"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <v-alert
      v-else-if="notFound"
      type="warning"
    >
      Rocket not found.
    </v-alert>

    <v-alert
      v-else-if="error"
      type="error"
    >
      {{ error }}
      <template #append>
        <v-btn
          variant="text"
          @click="loadRocket"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <template v-else-if="rocket">
      <v-img
        v-if="rocket.flickr_images?.[0]"
        :src="rocket.flickr_images[0]"
        max-height="420"
        cover
        rounded="lg"
        class="mb-6"
      />

      <div class="d-flex align-center flex-wrap ga-2 mb-3">
        <h1 class="text-h4 font-weight-bold">
          {{ rocket.name }}
        </h1>
        <v-chip
          :color="rocket.active ? 'success' : 'error'"
          label
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          label
        >
          Local
        </v-chip>
      </div>

      <p class="text-body-1 text-medium-emphasis mb-8">
        {{ rocket.description }}
      </p>

      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <v-card
            variant="tonal"
            color="blue"
          >
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-1">
                Cost Per Launch
              </div>
              <div class="text-h6">
                {{ formattedCost }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-card
            variant="tonal"
            color="green"
          >
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-1">
                Country
              </div>
              <div class="text-h6">
                {{ rocket.country || 'N/A' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-card
            variant="tonal"
            color="orange"
          >
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-1">
                First Flight
              </div>
              <div class="text-h6">
                {{ rocket.first_flight || 'N/A' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/useRocketStore'
import { fetchRocketById, ApiError } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const notFound = ref(false)

let controller: AbortController | null = null

const id = computed(() => route.params.id as string)
const isLocalId = computed(() => id.value.startsWith('local-'))

const formattedCost = computed(() => {
  const cost = rocket.value?.cost_per_launch
  if (cost == null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
})

async function loadRocket () {
  rocket.value = null
  error.value = null
  notFound.value = false

  const fromStore = store.findById(id.value)
  if (fromStore) {
    rocket.value = fromStore
    return
  }

  if (isLocalId.value) {
    notFound.value = true
    return
  }

  controller?.abort()
  controller = new AbortController()
  loading.value = true
  try {
    rocket.value = await fetchRocketById(id.value, controller.signal)
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') return
    if (err instanceof ApiError && err.isNotFound) {
      notFound.value = true
    } else {
      error.value = 'Failed to load rocket details. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadRocket)

onBeforeUnmount(() => {
  controller?.abort()
})
</script>
