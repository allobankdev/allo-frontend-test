<template>
  <v-card
    class="rocket-card h-100"
    :to="`/rockets/${rocket.id}`"
    variant="outlined"
  >
    <v-img
      v-if="rocket.imageUrl && !imageFailed"
      :alt="`${rocket.name} rocket`"
      class="rocket-card__image"
      cover
      :src="rocket.imageUrl"
      @error="imageFailed = true"
    />
    <div
      v-else
      class="rocket-card__image rocket-card__image--fallback"
      role="img"
      :aria-label="`No image available for ${rocket.name}`"
    >
      <v-icon
        icon="mdi-image-off-outline"
        size="36"
      />
      <span>Image unavailable</span>
    </div>
    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle>{{ rocket.country || 'Country not available' }}</v-card-subtitle>
    </v-card-item>
    <v-card-text class="rocket-card__description">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
const imageFailed = ref(false)
</script>

<style scoped>
.rocket-card { color: inherit; display: flex; flex-direction: column; text-decoration: none; padding-bottom: 1rem; }
.rocket-card:focus-visible { outline: 3px solid #0a55c7; outline-offset: 3px; }
.rocket-card__image { aspect-ratio: 16 / 9; }
.rocket-card__image--fallback { align-items: center; background: #e9eef5; color: #52616b; display: flex; flex-direction: column; gap: 8px; justify-content: center; }
.rocket-card__description {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  block-size: calc(1.425em * 3);
  color: #39465a;
  display: -webkit-box;
  flex: none;
  line-height: 1.425;
  overflow: hidden;
  overflow-wrap: anywhere;
}
</style>
