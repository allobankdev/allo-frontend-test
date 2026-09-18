<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl"
    elevation="3"
    hover
    @click="goToDetail"
  >
    <!-- Image with Fallback Handling -->
    <div class="image-wrapper position-relative">
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        height="220"
        cover
        class="align-end rocket-img"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </div>
        </template>
        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-surface-variant text-center px-4">
            <v-icon
              icon="mdi-rocket-outline"
              size="48"
              color="medium-emphasis"
              class="mb-2"
            />
            <span class="text-caption text-medium-emphasis">Image preview unavailable</span>
          </div>
        </template>
      </v-img>

      <!-- Fallback when image_url is completely null/missing -->
      <div
        v-else
        class="d-flex flex-column align-center justify-center bg-surface-variant text-center px-4"
        style="height: 220px;"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="56"
          color="primary"
          class="mb-2"
        />
        <span class="text-caption text-medium-emphasis">No image available</span>
      </div>

      <!-- Custom Rocket Chip -->
      <v-chip
        v-if="rocket.isCustom"
        color="secondary"
        size="small"
        label
        class="position-absolute font-weight-bold"
        style="top: 12px; right: 12px; z-index: 2;"
      >
        Custom
      </v-chip>

      <!-- Family Chip -->
      <v-chip
        v-else-if="rocket.family"
        color="primary"
        variant="elevated"
        size="small"
        class="position-absolute font-weight-medium"
        style="top: 12px; right: 12px; z-index: 2;"
      >
        {{ rocket.family }}
      </v-chip>
    </div>

    <!-- Content -->
    <v-card-item class="pb-1">
      <v-card-title
        class="text-h6 font-weight-bold text-truncate"
        :title="rocket.full_name || rocket.name"
      >
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
      <v-card-subtitle class="d-flex align-center gap-1 mt-1">
        <v-icon
          icon="mdi-map-marker-outline"
          size="16"
          class="mr-1"
        />
        <span>{{ rocket.manufacturer?.country_code || 'USA' }}</span>
        <span class="mx-1">•</span>
        <v-icon
          icon="mdi-calendar-blank-outline"
          size="16"
          class="mr-1"
        />
        <span>{{ formatFlightDate(rocket.maiden_flight) }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2">
      <p class="text-body-2 text-medium-emphasis description-clamp">
        {{ rocket.description || 'No description available for this launch vehicle.' }}
      </p>

      <v-divider class="my-3" />

      <div class="d-flex justify-space-between align-center">
        <div>
          <span class="text-caption text-medium-emphasis d-block">Cost per launch</span>
          <span class="text-body-2 font-weight-bold text-primary">
            {{ formatCost(rocket.launch_cost) }}
          </span>
        </div>

        <v-chip
          v-if="rocket.active !== undefined && rocket.active !== null"
          :color="rocket.active ? 'success' : 'default'"
          size="x-small"
          variant="tonal"
          class="font-weight-medium"
        >
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0 px-4 pb-4">
      <v-btn
        block
        color="primary"
        variant="tonal"
        class="text-none font-weight-bold rounded-lg"
        append-icon="mdi-arrow-right"
        @click.stop="goToDetail"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function goToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
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
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35) !important;
  border-color: rgba(var(--v-theme-primary), 0.4);
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
  min-height: 4.35em;
}
</style>
