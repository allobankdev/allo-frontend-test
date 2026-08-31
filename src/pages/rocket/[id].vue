<template>
  <v-container class="py-8 max-width-lg">
    <!-- Navigation Back Button -->
    <v-btn
      variant="tonal"
      rounded="pill"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      to="/"
    >
      Back to Rocket List
    </v-btn>

    <!-- Error State -->
    <ErrorRetryCard
      v-if="rocketStore.detailError"
      :message="rocketStore.detailError"
      @retry="loadDetail"
    />

    <!-- Loading Skeleton -->
    <v-card v-else-if="rocketStore.detailLoading" rounded="2xl" class="pa-6" elevation="2">
      <v-row>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="heading, subtitle, paragraph, paragraph, actions"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card>

    <!-- Detail Content (Success) -->
    <v-card v-else-if="rocket" rounded="2xl" class="overflow-hidden elevation-3" border>
      <v-row no-gutters>
        <!-- Left Image Column -->
        <v-col cols="12" md="6" class="position-relative">
          <v-img
            :src="rocket.image_url || fallbackImage"
            cover
            min-height="360"
            height="100%"
            class="align-end text-white"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
            
            <div class="pa-4 gradient-overlay w-100">
              <v-chip v-if="rocket.is_custom" color="secondary" size="small" class="font-weight-bold">
                Custom Rocket
              </v-chip>
              <v-chip v-else color="primary" size="small" class="font-weight-bold">
                SpaceX Launcher
              </v-chip>
            </div>
          </v-img>
        </v-col>

        <!-- Right Specs Column -->
        <v-col cols="12" md="6" class="pa-6 pa-md-8 d-flex flex-column justify-space-between">
          <div>
            <h1 class="text-h4 text-md-h3 font-weight-black mb-3">
              {{ rocket.full_name }}
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ rocket.description || 'No detailed description available for this launcher configuration.' }}
            </p>

            <v-divider class="mb-6"></v-divider>

            <!-- Specification Attributes Grid -->
            <h2 class="text-subtitle-2 text-uppercase font-weight-bold text-primary tracking-wide mb-4">
              Launcher Specifications
            </h2>

            <v-row class="ga-y-4">
              <!-- Cost Per Launch -->
              <v-col cols="12" sm="6">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="success-lighten-5" rounded="lg" size="44" class="mr-3">
                    <v-icon color="success">mdi-currency-usd</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Cost Per Launch</div>
                    <div class="text-body-1 font-weight-bold">
                      {{ formatCost(rocket.launch_cost) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Country of Origin -->
              <v-col cols="12" sm="6">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="info-lighten-5" rounded="lg" size="44" class="mr-3">
                    <v-icon color="info">mdi-flag-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Country</div>
                    <div class="text-body-1 font-weight-bold">
                      {{ formatCountry(rocket.manufacturer?.country_code) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- First Flight Date -->
              <v-col cols="12" sm="6">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="primary-lighten-5" rounded="lg" size="44" class="mr-3">
                    <v-icon color="primary">mdi-calendar-star</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">First Flight</div>
                    <div class="text-body-1 font-weight-bold">
                      {{ formatFlight(rocket.maiden_flight) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Manufacturer -->
              <v-col cols="12" sm="6">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="warning-lighten-5" rounded="lg" size="44" class="mr-3">
                    <v-icon color="warning">mdi-factory</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Manufacturer</div>
                    <div class="text-body-1 font-weight-bold text-truncate">
                      {{ rocket.manufacturer?.name || 'SpaceX' }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-card-actions class="px-0 pt-8">
            <v-btn
              variant="flat"
              color="primary"
              size="large"
              rounded="pill"
              block
              prepend-icon="mdi-arrow-left"
              to="/"
            >
              Back to Catalog
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>

    <!-- Fallback Not Found -->
    <v-card v-else class="pa-10 text-center rounded-xl border-dashed my-8" elevation="0">
      <v-icon size="64" color="medium-emphasis" class="mb-3">mdi-rocket-off</v-icon>
      <h3 class="text-h6 font-weight-bold">Rocket Not Found</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        The requested rocket configuration ID could not be located.
      </p>
      <v-btn color="primary" variant="flat" rounded="pill" to="/">
        Return to Catalog
      </v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '../../stores/rocketStore'
import ErrorRetryCard from '../../components/ErrorRetryCard.vue'

const route = useRoute()
const rocketStore = useRocketStore()

const rocketId = computed(() => (route.params as any).id)
const rocket = computed(() => rocketStore.selectedRocket)

const fallbackImage = 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop'

function loadDetail() {
  if (rocketId.value) {
    rocketStore.loadRocketById(rocketId.value)
  }
}

onMounted(() => {
  loadDetail()
})

function formatCost(cost: string | number | null | undefined): string {
  if (!cost) return 'Not Disclosed (N/A)'
  const digitsOnly = String(cost).replace(/[^0-9]/g, '')
  if (!digitsOnly) return String(cost)
  const num = parseFloat(digitsOnly)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}

function formatCountry(code: string | null | undefined): string {
  if (!code) return 'N/A'
  return code
}

function formatFlight(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.max-width-lg {
  max-width: 1040px;
}
.gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
}
.tracking-wide {
  letter-spacing: 1px;
}
.border-dashed {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
