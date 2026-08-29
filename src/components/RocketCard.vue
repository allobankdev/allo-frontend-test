<template>
  <v-card hover class="rocket-card" elevation="2" @click="goToDetail">
    <!-- Rocket Image -->
    <v-img
      :src="rocket.flickr_images[0] || 'https://placehold.co/330x200'"
      height="200"
      cover
      class="align-end">
      <!-- Status Badge on Image -->
      <v-chip
        :color="rocket.active ? 'success' : 'error'"
        class="ma-2"
        size="small"
        variant="elevated">
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-img>

    <!-- Card Content -->
    <v-card-title class="font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle class="text-grey-darken-1">
      {{ rocket.country }} • {{ rocket.company }}
    </v-card-subtitle>

    <v-card-text>
      <p class="text-body-2 rocket-description">
        {{ rocket.description }}
      </p>
    </v-card-text>

    <!-- Card Actions -->
    <v-card-actions>
      <v-btn variant="text" color="primary" append-icon="mdi-arrow-right"> View Details </v-btn>
      <v-spacer />
      <v-icon size="small" color="grey"> mdi-chevron-right </v-icon>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Rocket } from '@/types';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const goToDetail = () => {
  router.push(`/rockets/${props.rocket.id}`);
};
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 60px;
}
</style>
