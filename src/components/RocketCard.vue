<template>
  <v-card
    :aria-label="`View details for ${name}`"
    class="rocket-card"
    :to="`/rockets/${rocket.id}`"
    variant="flat"
  >
    <RocketImage
      :alt="name"
      class="rocket-card__media"
      :src="rocket.image_url"
    />

    <v-card-text class="rocket-card__body">
      <div class="rocket-card__labels">
        <span class="rocket-card__family">{{ familyLabel }}</span>
        <v-chip
          v-if="rocket.is_local"
          color="secondary"
          label
          size="x-small"
          variant="tonal"
        >
          Local
        </v-chip>
      </div>

      <h2>{{ name }}</h2>
      <p>{{ description }}</p>

      <div class="rocket-card__facts">
        <span>
          <v-icon
            icon="mdi-map-marker-outline"
            size="16"
          />
          {{ country }}
        </span>
        <span>
          <v-icon
            icon="mdi-calendar-blank-outline"
            size="16"
          />
          {{ firstFlight }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import {
    formatCountry,
    formatFirstFlight,
    getRocketDescription,
    getRocketFamily,
    getRocketName,
  } from '@/utils/rocket'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const name = computed(() => getRocketName(props.rocket))
  const description = computed(() => getRocketDescription(props.rocket))
  const country = computed(() => formatCountry(props.rocket))
  const firstFlight = computed(() => formatFirstFlight(props.rocket.maiden_flight))
  const familyLabel = computed(() => {
    const family = getRocketFamily(props.rocket)
    return family === 'other'
      ? 'Launch vehicle'
      : `${family[0].toUpperCase()}${family.slice(1)} family`
  })
</script>
