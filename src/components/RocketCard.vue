<template>
  <v-card
    :to="`/${rocket.id}`"
    class="rocket-card h-100"
    elevation="2"
    rounded="lg"
    hover
  >
    <v-img
      :src="rocket.image_url ?? fallbackImage"
      height="200"
      cover
    >
      <template #error>
        <v-img
          :src="fallbackImage"
          height="200"
          cover
        />
      </template>

      <v-chip
        :color="rocket.active ? 'success' : 'default'"
        class="ma-2"
        label
        size="small"
      >
        {{ rocket.active ? 'Active' : 'Retired' }}
      </v-chip>
    </v-img>

    <v-card-title class="text-wrap pt-4">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis description-clamp">
        {{ rocket.description || 'No description available.' }}
      </p>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-icon
        color="primary"
        size="small"
      >
        mdi-arrow-right
      </v-icon>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{
  rocket: Rocket
}>()

const fallbackImage = 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&q=80'
</script>

<style scoped>
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
