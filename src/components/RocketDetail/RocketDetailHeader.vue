<template>
  <div class="detail-header">
    <div class="image-container">
      <img
        v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
        :src="rocket.flickr_images[0]"
        :alt="rocket.name"
        class="detail-image"
      >
      <div
        v-else
        class="placeholder"
      >
        <v-icon size="96">
          mdi-rocket
        </v-icon>
      </div>
    </div>

    <div class="header-info">
      <h1 class="rocket-name">
        {{ rocket.name }}
      </h1>
      <div class="rocket-badges">
        <span class="badge">{{ rocket.type }}</span>
        <span class="badge">{{ rocket.country }}</span>
      </div>
      <p class="description">
        {{ rocket.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/stores/rocketStore'

interface Props {
  rocket: Rocket
}

defineProps<Props>()
</script>

<style scoped>
.detail-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  align-items: start;
}

.image-container {
  width: 100%;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rocket-name {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.rocket-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.description {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .detail-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .image-container {
    height: 300px;
  }

  .rocket-name {
    font-size: 28px;
  }
}
</style>
