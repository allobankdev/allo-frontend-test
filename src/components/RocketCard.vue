<script setup lang="ts">
import RocketImage from "@/components/RocketImage.vue";
import type { Rocket } from "@/types/rocket";

defineProps<{ rocket: Rocket }>();
</script>

<template>
  <v-card :to="`/rockets/${rocket.id}`" class="fill-height" hover>
    <RocketImage :src="rocket.image_url" />
    <v-card-title>{{ rocket.full_name }}</v-card-title>
    <v-card-text class="text-medium-emphasis">
      <p class="description">
        {{ rocket.description || "No description available." }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
