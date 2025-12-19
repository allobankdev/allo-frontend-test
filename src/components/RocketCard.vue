<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rocket: Rocket;
  clickable?: boolean;
}>();
</script>

<template>
  <v-card
    class="pa-4 mb-4 rocket-card"
    :class="{ clickable }"
  >
    <img
      v-if="rocket.flickr_images.length"
      :src="rocket.flickr_images[0]"
      class="rocket-image"
    />
    <h3>{{ rocket.name }}</h3>
    <p>{{ rocket.description }}</p>
  </v-card>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.rocket-image {
  max-width: 100%;
  margin-bottom: 8px;
}
</style>
