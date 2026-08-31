<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column transition-ease-in-out"
    elevation="2"
    hover
    rounded="xl"
    :to="`/rocket/${rocket.id}`"
  >
    <v-img
      :src="rocket.image_url || fallbackImage"
      height="240"
      cover
      class="align-end text-white"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>

      <div class="d-flex justify-space-between align-center ma-3">
        <v-chip
          v-if="rocket.is_custom"
          color="secondary"
          size="small"
          class="text-uppercase font-weight-bold"
          variant="elevated"
        >
          Custom
        </v-chip>
        <v-chip
          v-else-if="rocket.manufacturer?.country_code"
          color="surface-variant"
          size="small"
          class="font-weight-bold"
          variant="flat"
        >
          🇺🇸 {{ rocket.manufacturer.country_code }}
        </v-chip>

        <v-chip
          v-if="rocket.launch_cost"
          color="success"
          size="small"
          class="font-weight-bold"
          variant="flat"
        >
          {{ formatCostChip(rocket.launch_cost) }}
        </v-chip>
      </div>
    </v-img>

    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.full_name }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis card-description">
      {{ truncateText(rocket.description, 140) }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="px-4 py-3 justify-space-between align-center">
      <span class="text-caption font-weight-medium text-primary">View Details</span>
      <v-icon color="primary" size="small">mdi-arrow-right</v-icon>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '../types/rocket'

defineProps<{
  rocket: Rocket
}>()

const fallbackImage = 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop'

function truncateText(text: string | undefined | null, length: number): string {
  if (!text) return 'No description available for this rocket.'
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

function formatCostChip(cost: string | number | null | undefined): string {
  if (!cost) return ''
  const digitsOnly = String(cost).replace(/[^0-9]/g, '')
  if (!digitsOnly) return String(cost)
  const num = parseFloat(digitsOnly)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
.card-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
