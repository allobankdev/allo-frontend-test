<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocketStore";
import type { Rocket } from "@/types/rocket";

const route = useRoute();
const store = useRocketStore();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref("");

const fetchRocket = async () => {
  loading.value = true;
  error.value = "";

  try {
    const id = Number(route.params.id);

    const localRocket = store.rockets.find((item) => item.id === id);

    if (localRocket) {
      rocket.value = localRocket;
      return;
    }

    const response = await fetch(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch rocket");
    }

    rocket.value = await response.json();
  } catch {
    error.value = "Failed to load rocket details.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRocket);
</script>

<template>
  <v-container>
    <v-btn to="/" variant="text" class="mb-4"> Back to Rockets </v-btn>

    <div v-if="loading">Loading...</div>

    <div v-else-if="error">
      {{ error }}
      <v-btn @click="fetchRocket">Retry</v-btn>
    </div>

    <v-card v-else-if="rocket">
      <v-img :src="rocket.image_url || undefined" height="300" cover />

      <v-card-title>{{ rocket.full_name }}</v-card-title>

      <v-card-text>
        <p>{{ rocket.description || "No description available." }}</p>
        <p>
          <strong>Launch Cost:</strong> {{ rocket.launch_cost || "Unknown" }}
        </p>
        <p>
          <strong>Country:</strong>
          {{ rocket.manufacturer?.country_code || "Unknown" }}
        </p>
        <p>
          <strong>First Flight:</strong> {{ rocket.maiden_flight || "Unknown" }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
