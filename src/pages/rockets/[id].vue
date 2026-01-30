<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocket";

const route = useRoute();
const rocketStore = useRocketStore();

const rocketId = route.params.id as string;

const rocket = computed(() =>
  rocketStore.rockets.find((r) => r.id === rocketId),
);

onMounted(() => {
  if (!rocketStore.rockets.length) {
    rocketStore.fetchRockets();
  }
});
</script>

<template>
  <div>
    <RouterLink to="/">← Back</RouterLink>

    <!-- Loading -->
    <div v-if="rocketStore.loading">Loading...</div>

    <!-- Not Found -->
    <div v-else-if="!rocket">
      <p>Rocket not found</p>
    </div>

    <!-- Success -->
    <div v-else>
      <h1>{{ rocket.name }}</h1>

      <img
        v-if="rocket.flickr_images?.length"
        :src="rocket.flickr_images[0]"
        alt="rocket"
        style="max-width: 400px"
      />

      <p>{{ rocket.description }}</p>

      <ul>
        <li>
          <strong>Cost per launch:</strong> ${{
            rocket.cost_per_launch.toLocaleString()
          }}
        </li>
        <li><strong>Country:</strong> {{ rocket.country }}</li>
        <li><strong>First flight:</strong> {{ rocket.first_flight }}</li>
      </ul>
    </div>
  </div>
</template>
