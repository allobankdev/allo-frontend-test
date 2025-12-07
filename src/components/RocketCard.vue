<script setup lang="ts">
    import type { Rocket } from '@/stores/rockets'
    
    const props = defineProps<{
      rocket: Rocket
    }>()
</script>
    
<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
  >
    <v-img
      :src="rocket.images[0]"
      height="200"
      cover
    />
    <v-card-item>
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-subtitle>{{ rocket.country }}</v-card-subtitle>
    </v-card-item>
    <v-card-text class="text-truncate-3-lines">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>
    
<style scoped>
    .text-truncate-3-lines {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
}
</style>
    