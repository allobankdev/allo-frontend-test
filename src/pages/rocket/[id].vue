<template>
  <v-container>
    <p v-if="loading">Loading...</p>
    <div v-if="rocket">
      <v-img
        class="align-end text-white"
        height="200"
        :src="rocket.flickr_images[0]"
        cover
      >
      </v-img>
      <h1>{{ rocket.name }}</h1>
      <div>{{ rocket.description }}</div>
      <div>$ {{ rocket.cost_per_launch.toLocaleString("us") }}</div>
      <div>{{ rocket.country }}</div>
      <div>{{ rocket.first_flight }}</div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRocketsStore } from "@/stores/rocketStore.ts";

const route = useRoute();

const id = route.params.id as string;
const rocketsStore = useRocketsStore();
const { rocket, loading, error } = storeToRefs(rocketsStore);

onMounted(() => {
  rocketsStore.fetchRocketById(id);
});
</script>
