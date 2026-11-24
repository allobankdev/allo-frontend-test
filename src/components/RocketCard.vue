<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-lg overflow-hidden"
    elevation="2"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <div class="rocket-image-wrapper">
      <RocketImage
        :alt="rocket.name"
        class="rocket-image"
        :src="rocket.imageUrl"
      />
      <div class="rocket-image-gradient" />
    </div>

    <v-card-title class="rocket-title d-flex align-start justify-space-between ga-2 text-wrap pt-4 pb-1">
      <span class="rocket-title-text text-h6 font-weight-bold">{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        class="flex-shrink-0"
        color="primary"
        size="small"
        variant="tonal"
      >
        Local
      </v-chip>
    </v-card-title>

    <div
      v-if="rocket.country || maidenFlightYear"
      class="px-4 pb-1 d-flex flex-wrap ga-2"
    >
      <v-chip
        v-if="rocket.country"
        color="secondary"
        prepend-icon="mdi-flag"
        size="x-small"
        variant="tonal"
      >
        {{ rocket.country }}
      </v-chip>
      <v-chip
        v-if="maidenFlightYear"
        color="secondary"
        prepend-icon="mdi-calendar"
        size="x-small"
        variant="tonal"
      >
        {{ maidenFlightYear }}
      </v-chip>
    </div>

    <v-card-text class="flex-grow-1 pt-2">
      <p class="rocket-description text-body-2 text-medium-emphasis mb-0">
        {{ formatText(rocket.description, 'No description available.') }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatText } from '@/utils/format'

const props = defineProps<{
  rocket: Rocket
}>()

const maidenFlightYear = computed<string | null>(() => {
  const raw = props.rocket.maidenFlight
  if (!raw) {
    return null
  }
  const match = /^(\d{4})/.exec(raw.trim())
  return match?.[1] ?? null
})
</script>

<style scoped>
.rocket-card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.35) !important;
}

.rocket-image-wrapper {
  position: relative;
  overflow: hidden;
}

.rocket-image {
  transition: transform 200ms ease;
}

.rocket-card:hover .rocket-image {
  transform: scale(1.04);
}

.rocket-image-gradient {
  position: absolute;
  inset: auto 0 0 0;
  height: 56px;
  background: linear-gradient(to top, rgba(11, 16, 32, 0.55), transparent);
  pointer-events: none;
}

.rocket-title {
  overflow-wrap: anywhere;
}

.rocket-title-text {
  min-width: 0;
  overflow-wrap: anywhere;
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .rocket-card,
  .rocket-image {
    transition: none;
  }

  .rocket-card:hover {
    transform: none;
  }

  .rocket-card:hover .rocket-image {
    transform: none;
  }
}
</style>
