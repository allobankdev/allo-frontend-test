<script setup lang="ts">

import type { IRocketList } from '../types/rocket';
defineProps<{
  rocket: IRocketList;
}>();
</script>

<template>
  <v-card elevation="4" class="mx-auto" height="100%" hover>
          <v-img
            :src="rocket.flickr_images"
            height="200px"
            cover
          ></v-img>

          <v-card-title>
            {{ rocket.name }}
          </v-card-title>

          <v-card-text>
            <p class="text-truncate-3">{{ rocket.description }}</p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn :to="`/rocket/${rocket.id}`" color="primary" variant="text">Detail</v-btn>
            
          </v-card-actions>
        </v-card>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s ease-in-out;
}
.hover-card:hover {
  transform: translateY(-5px);
}
</style>