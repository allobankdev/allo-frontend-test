<template>
  <v-card
    class="rocket-card"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
      :alt="rocket.name"
      height="200"
      cover
    />
    <v-card-title class="text-h6">
      {{ rocket.name }}
    </v-card-title>
    <v-card-subtitle v-if="rocket.country">
      {{ rocket.country }}
    </v-card-subtitle>
    <v-card-text>
      <p class="text-body-2 text-truncate-3">
        {{ rocket.description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/services/spacexApi'

defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

