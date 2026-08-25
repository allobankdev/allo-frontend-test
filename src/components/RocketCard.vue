<template>
  <v-card
    class="rocket-card h-100 overflow-hidden"
    elevation="2"
    @click="$emit('click')"
  >
    <div class="image-container">
      <v-img
        :src="rocket.flickr_images[0]"
        height="240"
        cover
        class="rocket-image"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>
      <div class="image-overlay"></div>
    </div>

    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-center mb-2">
        <h3 class="text-h5 font-weight-bold text-truncate">{{ rocket.name }}</h3>
        <v-chip size="small" color="primary" variant="flat" density="compact">Active</v-chip>
      </div>
      <p class="text-body-1 text-medium-emphasis line-clamp-3 mb-4">
        {{ rocket.description }}
      </p>
    </v-card-text>

    <v-divider class="mx-6 opacity-10"></v-divider>

    <v-card-actions class="pa-6 pt-4">
      <span class="text-caption text-uppercase font-weight-bold letter-spacing-1 text-medium-emphasis">
        {{ rocket.country }}
      </span>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        class="font-weight-bold"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/services/api';

defineProps<{
  rocket: Rocket;
}>();

defineEmits(['click']);
</script>

<style scoped>
.rocket-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.rocket-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(33, 150, 243, 0.4) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.rocket-image {
  transition: transform 0.8s ease;
}

.rocket-card:hover .rocket-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(18, 18, 18, 0.8));
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
