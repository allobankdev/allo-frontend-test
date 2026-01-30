<script setup lang="ts">
import type { Rocket } from "@/stores/rocket";

defineProps<{
  rocket: Rocket;
}>();
</script>

<template>
  <div class="card">
    <img
      v-if="rocket.flickr_images?.length"
      :src="rocket.flickr_images[0]"
      alt="rocket"
      class="image"
    />

    <h3 class="title">{{ rocket.name }}</h3>
    <p class="desc">{{ rocket.description }}</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e5e5e5;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  height: 100%;
}

.image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.title {
  margin: 8px 0;
  font-size: 18px;
}

.desc {
  font-size: 14px;
  color: #555;
}
</style>
