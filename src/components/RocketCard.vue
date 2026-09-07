<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <div class="position-relative">
      <v-img
        :src="imageUrl"
        height="220"
        cover
        class="bg-grey-lighten-2"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
            <v-progress-circular color="primary" indeterminate></v-progress-circular>
          </div>
        </template>
        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-2 text-grey-darken-1">
            <v-icon icon="mdi-rocket-launch-outline" size="48" class="mb-2"></v-icon>
            <span class="text-caption font-italic">Image unavailable</span>
          </div>
        </template>
      </v-img>

      <!-- Status Chips Overlay -->
      <div class="card-status-overlay pa-2 d-flex gap-1 flex-wrap justify-end">
        <v-chip
          v-if="rocket.is_local"
          color="purple"
          variant="elevated"
          size="x-small"
          class="font-weight-bold"
        >
          LOCAL
        </v-chip>
        <v-chip
          :color="rocket.active ? 'success' : 'grey-darken-1'"
          variant="elevated"
          size="x-small"
          class="font-weight-bold"
        >
          {{ rocket.active ? 'ACTIVE' : 'INACTIVE' }}
        </v-chip>
      </div>
    </div>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.full_name || rocket.name }}
      </v-card-title>
      <v-card-subtitle v-if="rocket.manufacturer?.name || rocket.manufacturer?.country_code" class="text-caption">
        <v-icon icon="mdi-factory" size="small" class="mr-1"></v-icon>
        {{ rocket.manufacturer?.name || 'SpaceX' }}
        <span v-if="rocket.manufacturer?.country_code"> ({{ rocket.manufacturer.country_code }})</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2 text-grey-darken-2">
      <p class="description-clamp">
        {{ formattedDescription }}
      </p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3 justify-space-between align-center">
      <div class="d-flex align-center text-caption text-grey">
        <v-icon icon="mdi-calendar" size="small" class="mr-1"></v-icon>
        {{ formattedMaidenFlight }}
      </div>

      <v-btn
        color="primary"
        variant="tonal"
        size="small"
        append-icon="mdi-arrow-right"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const imageUrl = computed(() => {
  if (props.rocket.image_url && props.rocket.image_url.trim() !== '') {
    return props.rocket.image_url
  }
  return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80'
})

const formattedDescription = computed(() => {
  if (!props.rocket.description || props.rocket.description.trim() === '') {
    return 'No description available for this rocket.'
  }
  return props.rocket.description
})

const formattedMaidenFlight = computed(() => {
  if (!props.rocket.maiden_flight) return 'Flight date unknown'
  try {
    const date = new Date(props.rocket.maiden_flight)
    if (isNaN(date.getTime())) return props.rocket.maiden_flight
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return props.rocket.maiden_flight
  }
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin-bottom: 0;
}
.gap-1 {
  gap: 4px;
}
.card-status-overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
}
</style>
