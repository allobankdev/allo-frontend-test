<template>
  <!-- Card without hover effect per user request, explicitly colored white -->
  <v-card
    :to="`/rocket/${rocket.id}`"
    class="h-100 d-flex flex-column rounded-xl"
    elevation="2"
    color="white"
  >
    <!-- Responsive image covering top area -->
    <v-img
      :src="rocket.flickr_images[0] || 'https://via.placeholder.com/400x300'"
      height="200"
      cover
      class="bg-grey-lighten-2"
    >
      <!-- Visual status badge overlaid on image -->
      <div class="d-flex justify-end pa-3">
        <v-chip
          :color="rocket.active ? 'success' : 'grey-darken-1'"
          variant="flat"
          size="small"
          class="font-weight-bold"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
      </div>
    </v-img>

    <v-card-text class="flex-grow-1 pt-4 text-black">
      <div class="d-flex align-center justify-space-between mb-2">
        <h3 class="text-h6 font-weight-bold text-truncate">{{ rocket.name }}</h3>
        <span class="text-caption text-grey-darken-1">{{ rocket.country }}</span>
      </div>
      <!-- Truncate description for uniform card heights -->
      <p class="text-body-2 text-grey-darken-3 text-truncate-2-lines">
        {{ rocket.description }}
      </p>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <!-- Footer with cost information -->
    <v-card-actions class="px-4 py-3 bg-grey-lighten-4">
      <span class="text-caption text-grey-darken-2 font-weight-medium">
        Cost per Launch: <strong class="text-black">${{ formatCurrency(rocket.cost_per_launch) }}</strong>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { RocketDTO } from '@/types/rocket'

// Strict type definition for component props
defineProps<{ rocket: RocketDTO }>()

// Utility to format large numbers to readable currency
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  // If the value is small (e.g. 1000 from our simulated input), just show it normally
  return new Intl.NumberFormat('en-US').format(value)
}
</script>

<style scoped>
/* Clamp text to strictly 2 lines for UI consistency */
.text-truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
