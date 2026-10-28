<template>
  <v-container fluid class="pa-4 pa-sm-6">
    <!-- Back Button -->
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="router.back()"
    >
      Back to Rockets
    </v-btn>

    <!-- Loading State -->
    <template v-if="store.detailLoading">
      <v-skeleton-loader type="image" height="320" rounded="lg" class="mb-4" />
      <v-skeleton-loader type="heading, paragraph@3" />
    </template>

    <!-- Error State -->
    <template v-else-if="store.detailError">
      <v-row justify="center" class="mt-8">
        <v-col cols="12" sm="8" md="6" class="text-center">
          <v-icon icon="mdi-alert-circle-outline" size="80" color="error" class="mb-4" />
          <h2 class="text-h6 mb-2">Failed to load rocket</h2>
          <p class="text-body-2 text-medium-emphasis mb-4">{{ store.detailError }}</p>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-refresh"
            @click="retryDetail"
          >
            Retry
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <!-- Success State -->
    <template v-else-if="rocket">
      <v-row>
        <!-- Image -->
        <v-col cols="12" md="5">
          <v-card rounded="lg" elevation="3" class="overflow-hidden">
            <v-img
              :src="rocket.image_url ?? undefined"
              height="340"
              cover
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary" />
                </v-row>
              </template>
              <template #error>
                <div
                  class="fill-height d-flex flex-column align-center justify-center"
                  style="background: rgba(var(--v-theme-surface-variant), 0.5)"
                >
                  <v-icon icon="mdi-rocket-launch-outline" size="96" color="grey" />
                  <span class="text-caption text-grey mt-3">No Image Available</span>
                </div>
              </template>
            </v-img>

            <!-- Local badge -->
            <v-chip
              v-if="rocket.isLocal"
              class="ma-3"
              color="success"
              prepend-icon="mdi-plus-circle"
            >
              Locally Added
            </v-chip>
          </v-card>
        </v-col>

        <!-- Details -->
        <v-col cols="12" md="7">
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ rocket.full_name || 'Unknown Rocket' }}
          </h1>

          <!-- Stats chips -->
          <div class="d-flex flex-wrap gap-2 mb-4">
            <v-chip
              :color="rocket.manufacturer?.country_code ? 'primary' : 'grey'"
              variant="tonal"
              prepend-icon="mdi-flag"
              size="small"
            >
              {{ rocket.manufacturer?.country_code || 'Unknown Country' }}
            </v-chip>

            <v-chip
              :color="rocket.maiden_flight ? 'secondary' : 'grey'"
              variant="tonal"
              prepend-icon="mdi-calendar-star"
              size="small"
            >
              First Flight: {{ formatDate(rocket.maiden_flight) }}
            </v-chip>

            <v-chip
              :color="rocket.launch_cost ? 'success' : 'grey'"
              variant="tonal"
              prepend-icon="mdi-currency-usd"
              size="small"
            >
              {{ formatCost(rocket.launch_cost) }}
            </v-chip>
          </div>

          <!-- Detailed info table -->
          <v-card variant="outlined" rounded="lg" class="mb-4">
            <v-list density="compact" lines="two">
              <v-list-item
                prepend-icon="mdi-flag-variant"
                title="Country"
                :subtitle="rocket.manufacturer?.country_code || 'N/A'"
              />
              <v-divider />
              <v-list-item
                prepend-icon="mdi-calendar-star"
                title="First Flight"
                :subtitle="formatDate(rocket.maiden_flight)"
              />
              <v-divider />
              <v-list-item
                prepend-icon="mdi-currency-usd"
                title="Cost per Launch"
                :subtitle="formatCost(rocket.launch_cost)"
              />
            </v-list>
          </v-card>

          <!-- Description -->
          <div>
            <h3 class="text-subtitle-1 font-weight-bold mb-2">
              <v-icon icon="mdi-text-box-outline" class="mr-1" />
              Description
            </h3>
            <p v-if="rocket.description" class="text-body-2">
              {{ rocket.description }}
            </p>
            <p v-else class="text-body-2 text-medium-emphasis font-italic">
              No description available for this rocket.
            </p>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'

const router = useRouter()
const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => Number(route.params.id))
const rocket = computed(() => store.selectedRocket)

// Lifecycle: fetch rocket detail on mount
onMounted(async () => {
  await store.loadRocketDetail(rocketId.value)
})

// Cleanup on unmount
onUnmounted(() => {
  store.clearSelectedRocket()
})

async function retryDetail() {
  await store.retryLoadRocketDetail(rocketId.value)
}

function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  } catch {
    return date
  }
}

function formatCost(cost: string | null | undefined): string {
  if (!cost) return 'N/A'
  const num = Number(cost)
  if (isNaN(num)) return cost
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}
</script>

