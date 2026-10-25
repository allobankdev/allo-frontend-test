<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useRocketStore } from "@/stores/rocket_store";

const route = useRoute();
const rocketStore = useRocketStore();

const { rockets, loading } = storeToRefs(rocketStore);

const rocket = computed(() => {
  const id = Number(route.params.id);

  return rockets.value.find((item) => item.id === id);
});

onMounted(() => {
  if (rockets.value.length === 0) {
    rocketStore.fetchRockets();
  }
});
</script>

<template>
  <div class="pa-6">
    <v-btn prepend-icon="mdi-arrow-left" variant="text" to="/" class="mb-4">
      Back to Rockets
    </v-btn>

    <div v-if="loading" class="d-flex justify-center pa-10">
      <v-progress-circular indeterminate size="50" />
    </div>

    <v-alert v-else-if="!rocket" type="error" variant="tonal">
      Rocket not found.
    </v-alert>

    <v-card v-else max-width="900" class="mx-auto">
      <v-img :src="rocket.image || undefined" height="400" cover>
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            No Image
          </div>
        </template>
      </v-img>

      <v-card-title class="text-h4">
        {{ rocket.name }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-6">
          {{ rocket.description || "No description available." }}
        </p>

        <div class="mb-3">
          <strong>Cost per Launch:</strong>
          {{ rocket.cost_perlaunch || " " }}
        </div>

        <div class="mb-3">
          <strong>Country:</strong>
          {{ rocket.country || " " }}
        </div>

        <div>
          <strong>First Flight:</strong>
          {{ rocket.first_flight || " " }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
