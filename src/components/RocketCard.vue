<template>
  <v-card class="rocket-card" hover @click="$emit('click')">
    <v-img
      :src="
        rocket.flickr_images[0] ||
        'https://via.placeholder.com/400x300?text=No+Image'
      "
      height="200"
      cover
    ></v-img>

    <v-card-title>{{ rocket.rocket_name }}</v-card-title>

    <v-card-subtitle>
      <v-chip :color="rocket.active ? 'success' : 'error'" size="small">
        {{ rocket.active ? "Active" : "Inactive" }}
      </v-chip>
      <span class="ml-2">{{ rocket.country }}</span>
    </v-card-subtitle>

    <v-card-text>
      <p class="text-truncate-2">{{ rocket.description }}</p>
      <div class="mt-2">
        <v-icon small>mdi-cash</v-icon>
        <span class="ml-1">${{ rocket.cost_per_launch.toLocaleString() }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from "../types/rocket";

defineProps<{
  rocket: Rocket;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.rocket-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
