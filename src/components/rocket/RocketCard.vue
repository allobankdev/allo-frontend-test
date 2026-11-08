<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatYear } from '@/utils/format'
import RocketImage from './RocketImage.vue'
import RocketStatusChips from './RocketStatusChips.vue'

const props = defineProps<{
  rocket: Rocket
}>()

const cost = computed(() => formatCurrency(props.rocket.launchCost, { compact: true }))
const firstFlightYear = computed(() => formatYear(props.rocket.firstFlight))
</script>

<template>
  <v-card
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
    class="rocket-card d-flex flex-column h-100"
    color="surface"
    variant="flat"
    border
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
    />

    <v-card-item class="pb-1">
      <h2 class="text-h6 font-weight-bold text-wrap">
        {{ rocket.name }}
      </h2>
      <p
        v-if="rocket.family"
        class="text-body-2 text-medium-emphasis"
      >
        {{ rocket.family }} family
      </p>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1">
      <p
        class="line-clamp text-body-2"
        :class="{ 'text-medium-emphasis font-italic': !rocket.description }"
        style="--lines: 3"
      >
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>

    <div class="px-4 pb-2">
      <RocketStatusChips
        :rocket="rocket"
        size="x-small"
      />
    </div>

    <v-divider class="mt-2" />

    <div class="d-flex justify-space-between text-body-2 px-4 py-3">
      <span>
        <span class="text-medium-emphasis">Cost </span>
        <strong>{{ cost ?? '—' }}</strong>
      </span>
      <span>
        <span class="text-medium-emphasis">First flight </span>
        <strong>{{ firstFlightYear ?? '—' }}</strong>
      </span>
    </div>
  </v-card>
</template>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover,
.rocket-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
</style>
