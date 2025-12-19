<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRocketById } from "@/services/rocketService";
import type { Rocket } from "@/types/rocket";

const route = useRoute();
const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchRocket = async () => {
  loading.value = true;
  error.value = null;

  try {
    rocket.value = await getRocketById(route.params.id as string);
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
  <div v-if="loading">Loading rocket details...</div>

  <div v-else-if="error">
    <p>{{ error }}</p>
  </div>

  <v-card v-else-if="rocket" class="pa-4">
    <img
      v-if="rocket.flickr_images.length"
      :src="rocket.flickr_images[0]"
      style="max-width: 100%; margin-bottom: 16px"
    />
    <h1>{{ rocket.name }}</h1>
    <p>{{ rocket.description }}</p>

    <ul>
      <li><strong>Country:</strong> {{ rocket.country }}</li>
      <li><strong>First flight:</strong> {{ rocket.first_flight }}</li>
      <li>
        <strong>Cost per launch:</strong>
        ${{ rocket.cost_per_launch?.toLocaleString() }}
      </li>
    </ul>
  </v-card>
</v-container>
</template>