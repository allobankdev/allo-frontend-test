<template>
  <v-container
    fluid
    class="py-6 px-4 px-md-6"
  >
    <!-- Top Navigation / Back Button -->
    <div class="d-flex align-center justify-space-between mb-6">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="text-none font-weight-bold"
        rounded="lg"
        @click="goBack"
      >
        Back to Rockets
      </v-btn>

      <v-chip
        v-if="rocket?.family"
        color="primary"
        variant="outlined"
        size="small"
      >
        Family: {{ rocket.family }}
      </v-chip>
    </div>

    <!-- Loading State -->
    <StateLoading
      v-if="isLoading"
      title="Loading Rocket Details..."
      subtitle="Fetching vehicle specifications and telemetry"
    />

    <!-- Error State -->
    <StateError
      v-else-if="hasError"
      :message="errorMessage"
      @retry="fetchRocketData"
    />

    <!-- Success State / Rocket Detail View -->
    <div v-else-if="rocket">
      <v-card
        class="rounded-2xl overflow-hidden mb-6"
        elevation="4"
        border
      >
        <v-row no-gutters>
          <!-- Rocket Image Section -->
          <v-col
            cols="12"
            md="5"
            class="position-relative bg-surface-variant"
          >
            <v-img
              v-if="rocket.image_url"
              :src="rocket.image_url"
              height="100%"
              min-height="360"
              max-height="520"
              cover
              class="rocket-detail-img"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  />
                </div>
              </template>
              <template #error>
                <div class="d-flex flex-column align-center justify-center fill-height text-center pa-6">
                  <v-icon
                    icon="mdi-rocket-outline"
                    size="72"
                    color="medium-emphasis"
                    class="mb-3"
                  />
                  <span class="text-body-2 text-medium-emphasis">Image preview unavailable</span>
                </div>
              </template>
            </v-img>

            <!-- Fallback for null/missing image_url -->
            <div
              v-else
              class="d-flex flex-column align-center justify-center fill-height text-center pa-8"
              style="min-height: 360px;"
            >
              <v-icon
                icon="mdi-rocket-launch-outline"
                size="84"
                color="primary"
                class="mb-3"
              />
              <span class="text-body-1 font-weight-medium text-medium-emphasis">No image available for this vehicle</span>
            </div>

            <!-- Custom Badge -->
            <v-chip
              v-if="rocket.isCustom"
              color="secondary"
              label
              class="position-absolute font-weight-bold"
              style="top: 16px; left: 16px; z-index: 2;"
            >
              User Created
            </v-chip>
          </v-col>

          <!-- Main Info Section -->
          <v-col
            cols="12"
            md="7"
            class="pa-6 pa-md-8 d-flex flex-column"
          >
            <!-- Header Badges -->
            <div class="d-flex flex-wrap align-center gap-2 mb-3">
              <v-chip
                v-if="rocket.active !== null && rocket.active !== undefined"
                :color="rocket.active ? 'success' : 'grey'"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ rocket.active ? 'Active Status' : 'Retired' }}
              </v-chip>

              <v-chip
                v-if="rocket.reusable !== null && rocket.reusable !== undefined"
                :color="rocket.reusable ? 'info' : 'warning'"
                size="small"
                variant="tonal"
                class="font-weight-medium"
              >
                {{ rocket.reusable ? 'Reusable Vehicle' : 'Expendable' }}
              </v-chip>
            </div>

            <!-- Rocket Name -->
            <h1 class="text-h4 font-weight-black mb-3">
              {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
            </h1>

            <!-- Manufacturer & Country -->
            <div class="d-flex align-center text-body-1 text-medium-emphasis mb-4">
              <v-icon
                icon="mdi-domain"
                size="20"
                class="mr-2"
              />
              <span>{{ rocket.manufacturer?.name || 'SpaceX' }}</span>
              <span class="mx-2">•</span>
              <v-icon
                icon="mdi-earth"
                size="20"
                class="mr-2"
              />
              <span>Country: <strong>{{ rocket.manufacturer?.country_code || 'USA' }}</strong></span>
            </div>

            <!-- Description -->
            <p
              class="text-body-1 text-medium-emphasis mb-6"
              style="line-height: 1.7;"
            >
              {{ rocket.description || 'No detailed description available for this rocket configuration.' }}
            </p>

            <v-spacer />

            <v-divider class="my-4" />

            <!-- Core Required Metrics Grid -->
            <v-row dense>
              <v-col
                cols="12"
                sm="4"
              >
                <v-card
                  variant="tonal"
                  color="surface-variant"
                  class="pa-3 rounded-lg text-center"
                >
                  <span class="text-caption text-medium-emphasis d-block mb-1">Cost Per Launch</span>
                  <span class="text-subtitle-1 font-weight-bold text-primary">
                    {{ formatCost(rocket.launch_cost) }}
                  </span>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-card
                  variant="tonal"
                  color="surface-variant"
                  class="pa-3 rounded-lg text-center"
                >
                  <span class="text-caption text-medium-emphasis d-block mb-1">Country</span>
                  <span class="text-subtitle-1 font-weight-bold">
                    {{ rocket.manufacturer?.country_code || 'N/A' }}
                  </span>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                sm="4"
              >
                <v-card
                  variant="tonal"
                  color="surface-variant"
                  class="pa-3 rounded-lg text-center"
                >
                  <span class="text-caption text-medium-emphasis d-block mb-1">First Flight</span>
                  <span class="text-subtitle-1 font-weight-bold">
                    {{ formatFlightDate(rocket.maiden_flight) }}
                  </span>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <!-- Additional Technical Specifications (if available) -->
      <v-card
        class="rounded-2xl pa-6 mb-6"
        elevation="2"
        border
      >
        <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
          <v-icon
            icon="mdi-cog-outline"
            class="mr-2"
            color="primary"
          />
          Technical Specifications & Statistics
        </h3>

        <v-row dense>
          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">Height / Length</span>
              <span class="text-body-1 font-weight-bold">
                {{ rocket.length ? `${rocket.length} m` : 'N/A' }}
              </span>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">Diameter</span>
              <span class="text-body-1 font-weight-bold">
                {{ rocket.diameter ? `${rocket.diameter} m` : 'N/A' }}
              </span>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">Launch Mass</span>
              <span class="text-body-1 font-weight-bold">
                {{ rocket.launch_mass ? `${rocket.launch_mass.toLocaleString()} t` : 'N/A' }}
              </span>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">LEO Capacity</span>
              <span class="text-body-1 font-weight-bold">
                {{ rocket.leo_capacity ? `${rocket.leo_capacity.toLocaleString()} kg` : 'N/A' }}
              </span>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">Total Launches</span>
              <span class="text-body-1 font-weight-bold">
                {{ rocket.total_launch_count ?? 'N/A' }}
              </span>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="4"
            md="2"
          >
            <div class="spec-box pa-3 rounded-lg bg-surface-variant text-center">
              <span class="text-caption text-medium-emphasis d-block">Successful Launches</span>
              <span class="text-body-1 font-weight-bold text-success">
                {{ rocket.successful_launches ?? 'N/A' }}
              </span>
            </div>
          </v-col>
        </v-row>

        <!-- External Links if available -->
        <div
          v-if="rocket.wiki_url || rocket.info_url"
          class="d-flex gap-3 mt-6"
        >
          <v-btn
            v-if="rocket.wiki_url"
            :href="rocket.wiki_url"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            prepend-icon="mdi-wikipedia"
            class="text-none"
          >
            Wikipedia Article
          </v-btn>
          <v-btn
            v-if="rocket.info_url"
            :href="rocket.info_url"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            prepend-icon="mdi-open-in-new"
            class="text-none"
          >
            Official Info
          </v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'
import StateLoading from '@/components/StateLoading.vue'
import StateError from '@/components/StateError.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref<string | null>(null)

async function fetchRocketData() {
  const id = (route.params as { id: string }).id
  if (!id) {
    hasError.value = true
    errorMessage.value = 'Invalid rocket identifier.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  hasError.value = false
  errorMessage.value = null

  try {
    const data = await store.getRocketById(id)
    if (data) {
      rocket.value = data
    } else {
      hasError.value = true
      errorMessage.value = store.detailError || 'Rocket could not be found.'
    }
  } catch (err: unknown) {
    hasError.value = true
    errorMessage.value = err instanceof Error ? err.message : 'Failed to retrieve rocket.'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push('/')
}

function formatCost(cost: string | null | undefined): string {
  if (!cost) return 'N/A'
  const num = Number(cost)
  if (isNaN(num)) return cost
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

function formatFlightDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

onMounted(() => {
  fetchRocketData()
})
</script>

<style scoped>
.spec-box {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
