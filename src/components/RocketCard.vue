<template>
  <v-card
    class="mx-auto h-100 d-flex flex-column transition-swing hover-card"
    max-width="400"
    elevation="3"
    rounded="xl"
    @click="navigateToDetail"
  >
    <v-img
      class="align-end text-white"
      height="250"
      :src="imageUrl"
      cover
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
          <v-icon icon="mdi-rocket-outline" size="48" color="grey"></v-icon>
        </div>
      </template>
      <div class="image-gradient fill-height d-flex flex-column justify-end pa-4">
        <v-card-title class="text-h5 font-weight-bold px-0 text-white pb-0" style="word-break: normal; white-space: normal;">
          {{ rocket.full_name }}
        </v-card-title>
      </div>
    </v-img>

    <v-card-text class="flex-grow-1 pt-4 text-body-1 text-medium-emphasis">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        color="primary"
        variant="tonal"
        class="text-none px-4"
        rounded="pill"
        block
        append-icon="mdi-arrow-right"
      >
        Lihat Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Rocket } from '../services/api';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const imageUrl = computed(() => {
  return props.rocket.image_url || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800&auto=format&fit=crop';
});

const truncatedDescription = computed(() => {
  const desc = props.rocket.description;
  if (!desc) return 'Tidak ada deskripsi yang tersedia.';
  return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
});

const navigateToDetail = () => {
  router.push(`/rockets/${props.rocket.id}`);
};
</script>

<style scoped>
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.25) !important;
  cursor: pointer;
}

.image-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%);
}
</style>
