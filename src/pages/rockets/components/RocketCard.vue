<template>
  <v-card class="h-100">
    <v-img
      v-if="rocket.flickrImages.length > 0"
      :src="rocket.flickrImages[0]"
      height="200"
      cover
    >
      <v-chip :color="rocket.isActive ? 'success' : 'error'" class="ma-2" size="small">
        {{ rocket.isActive ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-img>

    <v-card-title>{{ rocket.name }}</v-card-title>

    <v-card-text>
      <p class="text-body-2">{{ rocket.description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn :to="`/rockets/${rocket.id}`" variant="text" color="primary">View Detail</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketEntity } from '@/core/entities/rocket.entity';

interface Props {
  rocket: RocketEntity;
}

defineProps<Props>();
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
