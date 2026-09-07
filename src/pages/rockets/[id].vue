<template>
  <div>
    <!-- Back Button -->
    <div class="mb-4">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="tonal"
        color="indigo-darken-3"
        to="/"
      >
        Back to Rocket List
      </v-btn>
    </div>

    <!-- Loading State -->
    <v-card v-if="loading" class="pa-8 text-center my-6" elevation="1">
      <v-progress-circular color="primary" indeterminate size="64" class="mb-4"></v-progress-circular>
      <div class="text-subtitle-1 text-grey-darken-2">Loading rocket details...</div>
    </v-card>

    <!-- Error / Not Found State -->
    <v-card v-else-if="!rocket" class="pa-8 text-center my-6 bg-red-lighten-5" border elevation="1">
      <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-3"></v-icon>
      <h2 class="text-h5 font-weight-bold text-error mb-2">Rocket Not Found</h2>
      <p class="text-body-1 text-grey-darken-2 mb-4">
        We could not find details for this rocket.
      </p>
      <v-btn color="primary" to="/" prepend-icon="mdi-arrow-left">Return to Catalog</v-btn>
    </v-card>

    <!-- Rocket Detail View -->
    <v-card v-else class="overflow-hidden" elevation="3">
      <v-row no-gutters>
        <!-- Rocket Image Section -->
        <v-col cols="12" md="5" lg="6" class="position-relative">
          <v-img
            :src="imageUrl"
            height="100%"
            min-height="350"
            cover
            class="bg-grey-lighten-2"
          ></v-img>

          <!-- Status badges overlay -->
          <div class="status-overlay pa-4 d-flex gap-2 flex-wrap">
            <v-chip
              v-if="rocket.is_local"
              color="purple"
              variant="elevated"
              class="font-weight-bold"
            >
              LOCAL CREATION
            </v-chip>
            <v-chip
              :color="rocket.active ? 'success' : 'grey-darken-2'"
              variant="elevated"
              class="font-weight-bold"
            >
              {{ rocket.active ? 'ACTIVE' : 'INACTIVE' }}
            </v-chip>
            <v-chip
              v-if="isReusableDefined"
              :color="rocket.reusable ? 'info' : 'warning'"
              variant="elevated"
              class="font-weight-bold"
            >
              {{ rocket.reusable ? 'REUSABLE' : 'SINGLE USE' }}
            </v-chip>
          </div>
        </v-col>

        <!-- Rocket Info Content Section -->
        <v-col cols="12" md="7" lg="6">
          <div class="pa-6 pa-md-8 d-flex flex-column fill-height">
            <!-- Header -->
            <div class="mb-4">
              <h1 class="text-h3 font-weight-bold text-grey-darken-4 mb-1">
                {{ rocket.full_name || rocket.name }}
              </h1>
              <div v-if="hasVariantName" class="text-subtitle-1 text-primary font-weight-medium">
                Variant / Model: {{ rocket.name }}
              </div>
            </div>

            <v-divider class="mb-6"></v-divider>

            <!-- Specification Cards Grid -->
            <v-row dense class="mb-6">
              <!-- Cost Per Launch -->
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="teal" class="pa-3 text-center rounded-lg">
                  <v-icon icon="mdi-currency-usd" color="green-darken-2" size="28" class="mb-1"></v-icon>
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Cost Per Launch</div>
                  <div class="text-subtitle-1 font-weight-bold text-green-darken-3 text-truncate">
                    {{ formattedCost }}
                  </div>
                </v-card>
              </v-col>

              <!-- Country -->
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="indigo" class="pa-3 text-center rounded-lg">
                  <v-icon icon="mdi-flag-outline" color="indigo-darken-2" size="28" class="mb-1"></v-icon>
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Country</div>
                  <div class="text-subtitle-1 font-weight-bold text-indigo-darken-3 text-truncate">
                    {{ formattedCountry }}
                  </div>
                </v-card>
              </v-col>

              <!-- First Flight -->
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="amber" class="pa-3 text-center rounded-lg">
                  <v-icon icon="mdi-calendar-star" color="amber-darken-3" size="28" class="mb-1"></v-icon>
                  <div class="text-caption text-grey-darken-2 font-weight-medium">First Flight</div>
                  <div class="text-subtitle-1 font-weight-bold text-amber-darken-4 text-truncate">
                    {{ formattedMaidenFlight }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Description -->
            <div class="mb-6 flex-grow-1">
              <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Overview</h3>
              <p class="text-body-1 text-grey-darken-2 line-height-relaxed">
                {{ formattedDescription }}
              </p>
            </div>

            <!-- Additional Metadata Table / Badges if present -->
            <div v-if="hasExtendedStats" class="bg-grey-lighten-4 pa-4 rounded-lg">
              <h4 class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2">Extended Specifications</h4>
              <v-row dense class="text-caption text-grey-darken-2">
                <v-col v-if="rocket.length" cols="6" sm="3">
                  <strong>Height:</strong> {{ rocket.length }} m
                </v-col>
                <v-col v-if="rocket.diameter" cols="6" sm="3">
                  <strong>Diameter:</strong> {{ rocket.diameter }} m
                </v-col>
                <v-col v-if="rocket.launch_mass" cols="6" sm="3">
                  <strong>Launch Mass:</strong> {{ rocket.launch_mass.toLocaleString() }} kg
                </v-col>
                <v-col v-if="rocket.successful_launches !== undefined" cols="6" sm="3">
                  <strong>Successful Launches:</strong> {{ rocket.successful_launches }}
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const store = useRocketStore()

const loading = ref(true)
const rocket = ref<Rocket | null>(null)

onMounted(async () => {
  loading.value = true
  const params = route.params as Record<string, any>
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  if (id) {
    rocket.value = await store.fetchRocketById(id)
  }
  loading.value = false
})

const isReusableDefined = computed(() => {
  return rocket.value?.reusable !== null && rocket.value?.reusable !== undefined
})

const hasVariantName = computed(() => {
  return !!(rocket.value?.name && rocket.value?.name !== rocket.value?.full_name)
})

const imageUrl = computed(() => {
  if (rocket.value?.image_url && rocket.value.image_url.trim() !== '') {
    return rocket.value.image_url
  }
  return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80'
})

const formattedCost = computed(() => {
  if (rocket.value?.launch_cost === null || rocket.value?.launch_cost === undefined || rocket.value?.launch_cost === '') {
    return 'N/A'
  }
  const numericCost = Number(rocket.value.launch_cost)
  if (isNaN(numericCost)) return String(rocket.value.launch_cost)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
})

const formattedCountry = computed(() => {
  const code = rocket.value?.manufacturer?.country_code
  if (!code || code.trim() === '') return 'N/A'
  return code.toUpperCase()
})

const formattedMaidenFlight = computed(() => {
  const flight = rocket.value?.maiden_flight
  if (!flight || flight.trim() === '') return 'N/A'
  try {
    const date = new Date(flight)
    if (isNaN(date.getTime())) return flight
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return flight
  }
})

const formattedDescription = computed(() => {
  if (!rocket.value?.description || rocket.value.description.trim() === '') {
    return 'No description available for this rocket.'
  }
  return rocket.value.description
})

const hasExtendedStats = computed(() => {
  if (!rocket.value) return false
  return !!(rocket.value.length || rocket.value.diameter || rocket.value.launch_mass || rocket.value.successful_launches !== undefined)
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.line-height-relaxed {
  line-height: 1.7;
}
.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
</style>
