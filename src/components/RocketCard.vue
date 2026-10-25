<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{
  rocket: Rocket
}>()

const fallbackImage =
  'https://placehold.co/600x400?text=Rocket+Image'

function formatDescription(description?: string | null) {
  return description || 'No description available.'
}
</script>

<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="h-100"
    rounded="lg"
    hover
  >
    <v-img
      :src="rocket.image_url || fallbackImage"
      :alt="rocket.full_name"
      height="220"
      cover
    />

    <v-card-title class="text-wrap">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis rocket-description">
        {{ formatDescription(rocket.description) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>