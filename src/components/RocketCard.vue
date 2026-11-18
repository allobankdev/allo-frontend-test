<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card h-100"
    rounded="lg"
    variant="tonal"
    hover
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
      height="180px"
    />

    <v-card-item class="pb-4">
      <v-card-title class="text-subtitle-1 font-weight-bold text-wrap">
        {{ rocket.name }}
      </v-card-title>
      <v-card-text class="px-0 pt-2 text-body-2 text-medium-emphasis description">
        {{ rocket.description ?? 'No description available.' }}
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import RocketImage from '@/components/RocketImage.vue'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
