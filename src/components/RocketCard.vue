<template>
  <v-card class="d-flex flex-column h-100" hover @click="$router.push(`/rocket/${rocket.id}`)">
    <v-img
      class="align-end bg-grey-lighten-2"
      height="250"
      :src="rocket.flickr_images && rocket.flickr_images.length ? rocket.flickr_images[0] : 'https://via.placeholder.com/400x250?text=No+Image'"
      cover
    >
      <v-card-title class="text-white bg-black bg-opacity-50" style="background: rgba(0,0,0,0.5)">
        {{ rocket.name }}
      </v-card-title>
    </v-img>

    <v-card-text class="flex-grow-1">
      <div class="text-truncate-3 text-body-1">{{ rocket.description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" variant="text">
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/stores/rocketStore'

defineProps<{
  rocket: Rocket
}>()
</script>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
