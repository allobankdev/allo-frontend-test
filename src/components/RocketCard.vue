<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl border transition-swing"
    elevation="2"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <div class="position-relative overflow-hidden">
      <v-img
        alt="Rocket Image"
        class="align-end bg-grey-darken-3"
        cover
        height="220"
        :src="getSafeImage(rocket.image_url)"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="primary"
              indeterminate
            />
          </div>
        </template>

        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-grey-darken-3 text-medium-emphasis">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="48"
            />
            <span class="text-caption mt-1">Image Unavailable</span>
          </div>
        </template>

        <!-- Gradient overlay -->
        <div class="gradient-overlay pa-3 d-flex justify-space-between align-end w-100">
          <v-chip
            v-if="rocket.manufacturer?.country_code"
            color="surface"
            density="comfortable"
            prepend-icon="mdi-earth"
            size="small"
            variant="flat"
          >
            {{ formatCountry(rocket.manufacturer.country_code) }}
          </v-chip>
          <v-chip
            v-if="rocket.is_custom"
            color="secondary"
            density="comfortable"
            prepend-icon="mdi-account-plus"
            size="small"
            variant="flat"
          >
            Custom
          </v-chip>
        </div>
      </v-img>
    </div>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
      <v-card-subtitle class="d-flex align-center ga-1 pt-1">
        <v-icon
          color="primary"
          icon="mdi-calendar-blank"
          size="16"
        />
        <span>{{ formatDate(rocket.maiden_flight) }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2 text-medium-emphasis rocket-description">
        {{ rocket.description || 'No detailed description available for this launcher configuration.' }}
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-3 bg-surface-light d-flex justify-space-between align-center">
      <div class="d-flex flex-column">
        <span class="text-caption text-medium-emphasis">Launch Cost</span>
        <span class="text-body-2 font-weight-bold text-primary">
          {{ formatCurrency(rocket.launch_cost) }}
        </span>
      </div>

      <v-btn
        append-icon="mdi-arrow-right"
        color="primary"
        size="small"
        variant="tonal"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatCountry, getSafeImage } from '@/utils/formatters'

defineProps<{
  rocket: Rocket
}>()
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 4.5em;
}

.gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%);
}
</style>
