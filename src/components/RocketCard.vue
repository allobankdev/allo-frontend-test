<script setup lang="ts">
/**
 * RocketCard.vue
 *
 * Presentational card for a single rocket. It receives the route through the
 * `to` prop, so the same component can be reused with or without navigation.
 */

// Composables
import { computed } from 'vue'

// Utilities
import { formatCountry, formatText } from '@/utils/formatters'

// Components
import RocketImage from './RocketImage.vue'

// Types
import type { Rocket } from '@/types/rocket'

const props = withDefaults(defineProps<{
  rocket: Rocket
  to?: string
}>(), {
  to: undefined,
})

const description = computed(() =>
  formatText(props.rocket.description, 'No description available for this rocket.')
)

const country = computed(() =>
  formatCountry(props.rocket.manufacturer?.country_code)
)
</script>

<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    :link="Boolean(to)"
    :to="to"
  >
    <RocketImage
      :alt="`${rocket.full_name} rocket`"
      :height="200"
      :src="rocket.image_url"
    />

    <v-card-item>
      <v-card-title class="text-h6">
        {{ rocket.full_name }}
      </v-card-title>

      <v-card-subtitle class="d-flex align-center flex-wrap ga-2 mt-1 pb-1">
        <span class="d-inline-flex align-center ga-1">
          <v-icon
            icon="mdi-earth"
            size="14"
          />
          {{ country }}
        </span>

        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="x-small"
          variant="tonal"
        >
          Added locally
        </v-chip>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2">
      <p class="rocket-card__description text-body-2 text-medium-emphasis">
        {{ description }}
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-btn
        v-if="to"
        append-icon="mdi-arrow-right"
        size="small"
        variant="text"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.rocket-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
