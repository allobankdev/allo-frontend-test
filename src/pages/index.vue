<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getRockets } from "@/services/rocketService";
import type { Rocket } from "@/types/rocket";

const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const search = ref("");

const fetchRockets = async () => {
  loading.value = true;
  error.value = null;

  try {
    rockets.value = await getRockets();
  } catch {
    error.value = "Failed to load rockets. Please try again.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRockets);

const filteredRockets = computed(() =>
  rockets.value.filter((rocket) =>
    rocket.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<template>
  <section>
    <h1>🚀 Rockets</h1>

    <input
      v-model="search"
      placeholder="Search rockets..."
      style="margin-bottom: 16px;"
    />

    <div v-if="loading">Loading rockets...</div>

    <div v-else-if="error">
      <p>{{ error }}</p>
      <button @click="fetchRockets">Retry</button>
    </div>

    <ul v-else>
      <li
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        style="margin-bottom: 16px;"
      >
        <img
          v-if="rocket.flickr_images.length"
          :src="rocket.flickr_images[0]"
          width="200"
        />
        <h3>{{ rocket.name }}</h3>
        <p>{{ rocket.description }}</p>
      </li>
    </ul>
  </section>
</template>
