<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ rocket: any }>()
</script>

<template>
  <RouterLink
    :to="`/rockets/${rocket.id}`"
    class="text-decoration-none"
  >
    <v-card elevation="3" class="hover-card">
      <v-img
        :src="rocket.flickr_images?.[0]"
        height="200"
        cover
      />
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-text class="text-truncate">
        {{ rocket.description }}
      </v-card-text>
    </v-card>
  </RouterLink>
</template>

<style scoped>
.hover-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.hover-card:hover {
  transform: translateY(-4px);
}
</style>
