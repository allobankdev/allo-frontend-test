<!--
  pages/rockets/[id].vue  →  /rockets/:id
  Rocket detail page.

  Strategy:
  1. For locally-added rockets (negative ids) there is no API record,
     so we fall back to the store data directly.
  2. For API rockets we first check the store cache to avoid an extra request,
     then fetch from the API if not found (e.g. hard refresh / direct URL).
-->
<template>
  <v-container class="py-8" style="max-width: 900px">
    <!-- Back button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 pl-0"
      @click="router.push('/rockets')"
    >
      Back to rockets
    </v-btn>

    <!-- ── Loading state ──────────────────────────────────────────────── -->
    <LoadingState v-if="status === 'loading'" message="Loading rocket details..." />

    <!-- ── Error state ────────────────────────────────────────────────── -->
    <ErrorState
      v-else-if="status === 'error'"
      title="Failed to load rocket details."
      :message="errorMessage ?? undefined"
      @retry="loadDetail"
    />

    <!-- ── Success state ──────────────────────────────────────────────── -->
    <template v-else-if="status === 'success' && rocket">
      <!-- Hero image -->
      <v-card class="mb-6 overflow-hidden" elevation="2">
        <RocketImage
          :src="rocket.image_url"
          :alt="rocket.full_name"
          :aspect-ratio="21 / 9"
        />
      </v-card>

      <!-- Main info -->
      <h1 class="text-h4 font-weight-bold mb-2">{{ rocket.full_name }}</h1>

      <p v-if="rocket.description" class="text-body-1 text-grey-lighten-1 mb-6">
        {{ rocket.description }}
      </p>
      <p v-else class="text-body-1 text-grey mb-6">No description available.</p>

      <!-- Detail chips / info grid -->
      <v-divider class="mb-6" />
      <h2 class="text-h6 font-weight-medium mb-4">Specifications</h2>

      <v-row>
        <v-col
          v-for="spec in specs"
          :key="spec.label"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card variant="tonal" class="pa-4 h-100">
            <div class="d-flex align-center ga-2 mb-1">
              <v-icon size="20" :color="spec.iconColor">{{ spec.icon }}</v-icon>
              <span class="text-caption text-grey text-uppercase font-weight-medium">
                {{ spec.label }}
              </span>
            </div>
            <p class="text-body-1 font-weight-medium mt-1">
              {{ spec.value ?? '—' }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { fetchRocketById } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'
import RocketImage from '@/components/rockets/RocketImage.vue'
import LoadingState from '@/components/rockets/LoadingState.vue'
import ErrorState from '@/components/rockets/ErrorState.vue'

type DetailStatus = 'idle' | 'loading' | 'success' | 'error'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const status = ref<DetailStatus>('idle')
const errorMessage = ref<string | null>(null)

const numericId = computed(() => {
  const raw = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  return Number(raw)
})

async function loadDetail() {
  status.value = 'loading'
  errorMessage.value = null

  const id = numericId.value

  // Locally-added rockets have negative ids — they only exist in the store
  if (id < 0) {
    const local = store.rockets.find((r) => r.id === id)
    if (local) {
      rocket.value = local
      status.value = 'success'
    } else {
      errorMessage.value = 'Rocket not found.'
      status.value = 'error'
    }
    return
  }

  // For API rockets: try store cache first to avoid an unnecessary request
  const cached = store.rockets.find((r) => r.id === id)
  if (cached) {
    rocket.value = cached
    status.value = 'success'
    return
  }

  // Not in cache — fetch directly from the API
  try {
    rocket.value = await fetchRocketById(id)
    status.value = 'success'
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : 'An unexpected error occurred.'
    status.value = 'error'
  }
}

// ── Specs display config ────────────────────────────────────────────────────

const specs = computed(() => [
  {
    label: 'Cost per launch',
    value: rocket.value?.launch_cost
      ? `$${Number(rocket.value.launch_cost).toLocaleString()}`
      : null,
    icon: 'mdi-currency-usd',
    iconColor: 'green',
  },
  {
    label: 'Country',
    value: rocket.value?.manufacturer?.country_code ?? null,
    icon: 'mdi-earth',
    iconColor: 'blue',
  },
  {
    label: 'First flight',
    value: rocket.value?.maiden_flight
      ? new Date(rocket.value.maiden_flight).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null,
    icon: 'mdi-calendar-star',
    iconColor: 'orange',
  },
])

onMounted(loadDetail)
</script>
