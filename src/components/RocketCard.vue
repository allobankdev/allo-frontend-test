<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images[0] || 'https://via.placeholder.com/300'"
      height="200"
      cover
      class="align-end"
    >
      <v-card-title class="text-white bg-black-opacity">
        {{ rocket.name }}
      </v-card-title>
    </v-img>

    <v-card-text class="flex-grow-1 pt-4">
      <div class="text-truncate-3">
        {{ rocket.description }}
      </div>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket';

defineProps<{
  rocket: Rocket;
}>();

defineEmits(['click']);
</script>

<style scoped>
.bg-black-opacity {
  background: rgba(0, 0, 0, 0.6);
}
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
