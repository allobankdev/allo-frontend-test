<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl"
    elevation="0"
    border
    @click="$emit('click', rocket.id)"
  >
    <div class="position-relative">
      <v-img
        :src="rocket.image_url || fallbackImage"
        :alt="rocket.full_name || rocket.name"
        height="220"
        cover
        class="bg-surface-bright"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-bright">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-surface-bright text-grey">
            <v-icon icon="mdi-rocket-launch-outline" size="48" />
            <span class="text-caption mt-1">Image Not Available</span>
          </div>
        </template>
      </v-img>

      <!-- Status Chips -->
      <div class="chips-overlay">
        <v-chip
          v-if="rocket.is_custom"
          color="warning"
          size="small"
          class="font-weight-bold mr-1"
          variant="flat"
        >
          <v-icon start icon="mdi-account-plus" size="14" />
          Custom
        </v-chip>
        <v-chip
          v-if="rocket.active !== null && rocket.active !== undefined"
          :color="rocket.active ? 'success' : 'grey-darken-1'"
          size="small"
          class="font-weight-bold"
          variant="flat"
        >
          <v-icon start :icon="rocket.active ? 'mdi-check-circle' : 'mdi-archive'" size="14" />
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>
      </div>
    </div>

    <v-card-item class="pb-1">
      <div class="d-flex justify-space-between align-center mb-1">
        <span class="text-caption text-primary font-weight-bold">
          {{ rocket.family || 'SpaceX Rocket' }}
        </span>
        <span v-if="rocket.manufacturer?.country_code" class="text-caption text-medium-emphasis">
          <v-icon icon="mdi-earth" size="14" class="mr-1" />
          {{ rocket.manufacturer.country_code }}
        </span>
      </div>
      <v-card-title class="text-h6 font-weight-bold text-truncate pa-0" :title="rocket.full_name || rocket.name">
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2">
      <p class="text-body-2 text-medium-emphasis text-clamp-3">
        {{ rocket.description || 'No detailed description available for this rocket.' }}
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-3 bg-surface-bright d-flex justify-space-between align-center">
      <div class="text-caption text-medium-emphasis">
        <span v-if="rocket.launch_cost">
          <strong class="text-high-emphasis">${{ formatCost(rocket.launch_cost) }}</strong> / launch
        </span>
        <span v-else class="text-disabled">Cost: N/A</span>
      </div>
      <v-btn
        color="primary"
        variant="text"
        size="small"
        append-icon="mdi-arrow-right"
        class="font-weight-bold text-none"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketLauncher } from '@/types/rocket'

defineProps<{
  rocket: RocketLauncher
}>()

defineEmits<{
  (e: 'click', id: string | number): void
}>()

const fallbackImage = 'https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=600&q=80'

function formatCost(cost: string | number): string {
  const num = Number(cost)
  if (isNaN(num)) return String(cost)
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  return num.toLocaleString()
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  overflow: hidden;
  background-color: var(--v-theme-surface);
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 189, 248, 0.45) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 15px rgba(56, 189, 248, 0.15) !important;
}

.chips-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.text-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}
</style>
