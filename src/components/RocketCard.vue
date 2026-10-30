<script setup lang="ts">
import type { Rocket } from '../types/rocket'

defineProps<{
  rocket: Rocket
}>()
</script>

<template>
  <v-card
    class="rocket-card h-100"
    elevation="2"
    rounded="lg"
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      height="220"
      cover
    >
      <template #error>
        <div class="image-placeholder">
          <v-icon icon="mdi-rocket" size="64" />
        </div>
      </template>
    </v-img>

    <div v-else class="image-placeholder">
      <v-icon icon="mdi-rocket" size="64" />
    </div>

    <v-card-title>
      {{ rocket.full_name || 'Unnamed Rocket' }}
    </v-card-title>

    <v-card-text>
      <p class="description">
        {{ rocket.description || 'No description available.' }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="tonal"
        :to="`/rockets/${rocket.id}`"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.image-placeholder {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9edf3;
  color: #64748b;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  line-height: 1.6;
}

.v-card-actions {
  margin-top: auto;
  padding: 16px;
}
</style>
