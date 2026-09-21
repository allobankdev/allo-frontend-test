<template>
  <v-container
    max-width="900"
    class="py-6"
  >
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4 px-2"
      @click="router.back()"
    >
      Back to list
    </v-btn>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader
          type="image"
          height="380"
          rounded="lg"
          class="mb-6"
        />
        <v-skeleton-loader type="heading, paragraph" />
      </v-col>
    </v-row>

    <!-- Error -->
    <AppError
      v-else-if="error"
      :message="error"
      @retry="loadRocket"
    />

    <!-- Detail -->
    <template v-else-if="rocket">
      <v-img
        :src="rocket.image_url ?? fallbackImage"
        max-height="400"
        cover
        rounded="lg"
        class="mb-6"
      >
        <template #error>
          <v-img
            :src="fallbackImage"
            max-height="400"
            cover
            rounded="lg"
          />
        </template>
      </v-img>

      <div class="d-flex align-center flex-wrap ga-2 mb-3">
        <h1 class="text-h4 font-weight-bold">
          {{ rocket.full_name }}
        </h1>
        <v-chip
          :color="rocket.active ? 'success' : 'default'"
          label
          size="small"
        >
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>
      </div>

      <p class="text-body-1 text-medium-emphasis mb-6">
        {{ rocket.description || 'No description available for this rocket.' }}
      </p>

      <v-divider class="mb-6" />

      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <p class="text-overline text-medium-emphasis mb-1">
            Cost Per Launch
          </p>
          <p class="text-h6 font-weight-medium">
            {{ rocket.launch_cost ? `$${Number(rocket.launch_cost).toLocaleString()}` : '—' }}
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <p class="text-overline text-medium-emphasis mb-1">
            Country
          </p>
          <p class="text-h6 font-weight-medium">
            {{ rocket.manufacturer?.country_code || '—' }}
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <p class="text-overline text-medium-emphasis mb-1">
            First Flight
          </p>
          <p class="text-h6 font-weight-medium">
            {{ rocket.maiden_flight ? formatDate(rocket.maiden_flight) : '—' }}
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fallbackImage = 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=900&q=80'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function loadRocket() {
  const id = Number(route.params.id)

  // Try store cache first to avoid extra API call
  const cached = store.rockets.find(r => r.id === id)
  if (cached) {
    rocket.value = cached
    return
  }

  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/?mode=detailed`
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    rocket.value = await res.json()
  } catch (e) {
    error.value = 'Could not load rocket details. Please try again.'
    console.error('loadRocket error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadRocket)
</script>
