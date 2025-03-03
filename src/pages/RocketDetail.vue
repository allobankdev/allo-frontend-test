<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRocketStore } from '@/store/rocketStore';

const route = useRoute();
const store = useRocketStore();
const rocket = ref(null);

onMounted(() => {
  const rocketId = route.params.id;
  rocket.value = store.rockets.find(r => r.id === rocketId);
});
</script>

<template>
  <div v-if="rocket">
    <h1>{{ rocket.name }}</h1>
    <img :src="rocket.flickr_images.length ? rocket.flickr_images[0] : 'https://via.placeholder.com/300'" 
         alt="Rocket Image" width="300" />
    <p>{{ rocket.description }}</p>
  </div>
  <div v-else>
    <p>Rocket not found.</p>
  </div>
</template>
