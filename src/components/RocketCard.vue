<template>
  <v-card
    class="rocket-card"
    variant="flat"
    elevation="0"
    @click="$emit('click')"
  >
    <div class="rocket-image-wrapper">
      <v-img
        :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
        :alt="rocket.name"
        height="240"
        cover
        class="rocket-image"
      />
    </div>
    <v-card-text class="pa-4">
      <div class="text-h6 font-weight-medium mb-1">
        {{ rocket.name }}
      </div>
      <div v-if="rocket.country" class="text-caption text-medium-emphasis mb-3">
        {{ rocket.country }}
      </div>
      <p class="text-body-2 text-medium-emphasis text-truncate-3">
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-border-opacity), var(--v-border-opacity));
  border-radius: 12px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.rocket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.rocket-image-wrapper {
  overflow: hidden;
  background: rgb(var(--v-theme-surface-variant));
}

.rocket-image {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rocket-card:hover .rocket-image {
  transform: scale(1.05);
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>

