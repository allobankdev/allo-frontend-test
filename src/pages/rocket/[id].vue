<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/store/rocket";

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

const rocket = computed(() =>
  rocketStore.rockets.find((r) => r.id === route.params.id)
);

onMounted(() => {
  if (!rocket.value) {
    rocketStore.fetchRockets();
  }
});

if (!rocket.value) {
  router.push("/");
}
</script>

<template>
  <v-container v-if="rocket">
    <v-btn color="blue" @click="router.push('/')">⬅ Back to List</v-btn>

    <v-card class="mt-4">
      <v-img :src="rocket.flickr_images[0]" height="300px" cover></v-img>
      <v-card-title class="headline">{{ rocket.name }}</v-card-title>
      <v-card-subtitle class="pb-2">{{ rocket.country }}</v-card-subtitle>
      <v-card-text>
        <v-divider class="my-2"></v-divider>
        <p><strong>Description:</strong></p>
        <p>{{ rocket.description }}</p>
        <v-divider class="my-2"></v-divider>
        <p>
          <strong>Cost per Launch:</strong>
          {{ rocket.cost_per_launch }}
        </p>
        <p>
          <strong>First Flight:</strong> {{ rocket.first_flight }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else>
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>
