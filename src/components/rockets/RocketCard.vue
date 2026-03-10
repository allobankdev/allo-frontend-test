<template>
  <v-card
    class="rocket-card h-100"
    rounded="xl"
    variant="flat"
  >
    <v-img
      :src="rocket.image"
      :alt="rocket.name"
      class="rocket-image"
      cover
      height="220"
    >
      <div class="d-flex justify-space-between align-start pa-4">
        <v-chip
          color="surface"
          label
          size="small"
          variant="flat"
        >
          {{ rocket.source === 'local' ? 'Local Draft' : 'SpaceX' }}
        </v-chip>

        <v-chip
          :color="rocket.active ? 'success' : 'warning'"
          label
          size="small"
          variant="flat"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
      </div>
    </v-img>

    <v-card-text class="pa-5">
      <div class="d-flex align-center justify-space-between ga-3 mb-3">
        <div>
          <p class="text-overline mb-1 text-medium-emphasis">
            {{ rocket.country }}
          </p>
          <h3 class="text-h6 font-weight-bold">
            {{ rocket.name }}
          </h3>
        </div>

        <v-btn
          color="primary"
          icon="mdi-arrow-top-right"
          variant="tonal"
          :to="detailPath"
        />
      </div>

      <p class="text-body-2 text-medium-emphasis mb-4 description">
        {{ rocket.description }}
      </p>

      <div class="d-flex flex-wrap ga-2">
        <v-chip
          prepend-icon="mdi-calendar"
          size="small"
          variant="outlined"
        >
          {{ firstFlightLabel }}
        </v-chip>

        <v-chip
          prepend-icon="mdi-cash"
          size="small"
          variant="outlined"
        >
          {{ costLabel }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import type { Rocket } from '@/types/rocket'
  import { formatDate, formatUsd } from '@/utils/format'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const detailPath = computed(() => `/rockets/${props.rocket.id}`)

  const costLabel = computed(() => formatUsd(props.rocket.costPerLaunch))
  const firstFlightLabel = computed(() => formatDate(props.rocket.firstFlight))
</script>

<style scoped>
  .rocket-card {
    border: 1px solid rgba(15, 23, 42, 0.08);
    overflow: hidden;
  }

  .rocket-image {
    background: linear-gradient(135deg, rgba(11, 15, 25, 0.08), rgba(11, 15, 25, 0.4));
  }

  .description {
    min-height: 72px;
  }
</style>
