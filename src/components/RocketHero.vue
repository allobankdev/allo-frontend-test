<script setup lang="ts">
import type { IRocket } from '@/types/rocket'
defineProps<{ rocket: IRocket }>()
</script>

<template>
  <v-img
    :src="rocket.flickr_images?.[0]"
    height="420"
    cover
    class="rounded-xl elevation-6"
  >
    <div class="hero-overlay">
      <h1 class="text-h3 font-weight-bold">
        {{ rocket.name }}
      </h1>

      <v-chip
        :color="rocket.active ? 'green' : 'red'"
        variant="flat"
      >
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </div>
  </v-img>
</template>

<style scoped>
.hero-overlay {
  position: absolute;
  bottom: 24px;
  left: 24px;
  color: white;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
