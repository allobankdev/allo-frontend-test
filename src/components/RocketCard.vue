<template>
  <!-- The whole card is a link to the detail page: /rockets/<id>. -->
  <v-card
    class="rocket-card"
    :to="`/rockets/${rocket.id}`"
    variant="elevated"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />
    <v-card-title class="d-flex align-center ga-2">
      <span class="text-truncate">{{ rocket.name }}</span>
      <!-- Marks rockets the user added in this session (not from the API). -->
      <v-chip
        v-if="rocket.isLocal"
        color="primary"
        label
        size="x-small"
      >
        New
      </v-chip>
    </v-card-title>
    <v-card-text class="rocket-card__description">
      {{ formatText(rocket.description, 'No description available.') }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { formatText } from '../utils/format'
  import type { Rocket } from '../types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.rocket-card {
  /* Cards in the same grid row get equal height. */
  height: 100%;
}

/* Show at most 4 lines of the description, then cut with an ellipsis. */
.rocket-card__description {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
}
</style>
