<template>
  <v-card class="mx-auto" hover @click="goToDetail">
    <v-img :src="rocket.flickr_images[0]" height="200px" cover />

    <v-card-title>{{ rocket.name }}</v-card-title>

    <v-card-text class="text-truncate-2 pb-10">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rocket";
import { useRouter } from "vue-router";

const props = defineProps<{ rocket: Rocket }>();
const router = useRouter();

const goToDetail = () => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
