<!--
  RocketCard.vue
  Displays a single rocket in the list: image, name, and truncated description.
  Emits a click event so the parent can navigate to the detail page.
-->
<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    :aria-label="`View details for ${rocket.full_name}`"
    hover
    @click="$emit('select', rocket.id)"
  >
    <RocketImage :src="rocket.image_url" :alt="rocket.full_name" :aspect-ratio="16 / 9" />

    <v-card-title class="text-h6 pt-3">{{ rocket.full_name }}</v-card-title>

    <v-card-text class="flex-grow-1">
      <p v-if="rocket.description" class="text-body-2 rocket-card__description">
        {{ rocket.description }}
      </p>
      <p v-else class="text-body-2 text-grey">No description available.</p>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        @click.stop="$emit('select', rocket.id)"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'
import RocketImage from './RocketImage.vue'

defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  (e: 'select', id: number): void
}>()
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.rocket-card:hover {
  transform: translateY(-2px);
}

/* Clamp description to 3 lines to keep cards uniform in height */
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
