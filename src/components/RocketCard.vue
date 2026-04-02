<template>
  <v-card
    class="h-100"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'"
      height="200"
      cover
      class="align-end"
    >
      <v-card-title class="text-white bg-black-opacity">
        {{ rocket.name }}
      </v-card-title>
    </v-img>
    <v-card-text class="pt-4">
      <div class="text-body-2 text-truncate-3">
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

<script lang="ts" setup>
import type { Rocket } from '@/stores/rocketStore';

defineProps<{
  rocket: Rocket;
}>();

defineEmits(['click']);
</script>

<style scoped>
.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.5);
}
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
