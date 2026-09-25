<template>
  <v-card
    height="100%"
    class="d-flex flex-column"
    color="#1E1F0A"
    variant="flat"
    rounded="10"
    :ripple="false"
    @click="goToDetail"
  >
    <v-img
      :src="rocket.image_url || 'https://via.placeholder.com/400x300?text=No+Image'"
      height="220"
      cover
      class="bg-grey-lighten-2"
    />

    <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-3 text-white">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text class="flex-grow-1 px-0 pb-4">
      <p class="text-body-2 text-grey-lighten-1 line-clamp-5">
        {{ rocket.description || 'Tidak ada deskripsi tersedia.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Rocket } from '../types/rocket';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const goToDetail = () => {
  router.push(`/${props.rocket.id}`);
};
</script>

<style scoped>
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.v-card__overlay) {
  display: none !important;
}
</style>
