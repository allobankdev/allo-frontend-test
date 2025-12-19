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

const showForm = ref(false);

const newRocket = ref<Rocket>({
  id: "",
  name: "",
  description: "",
  flickr_images: [],
  isLocal: true,
});

const addRocket = () => {
  if (!newRocket.value.name || !newRocket.value.description) return;

  rockets.value.unshift({
    ...newRocket.value,
    id: crypto.randomUUID(),
  });

  newRocket.value = {
    id: "",
    name: "",
    description: "",
    flickr_images: [],
    isLocal: true,
  };

  showForm.value = false;
};
</script>

<template>
  <v-container>
    <h1>Rockets</h1>

    <v-text-field
      v-model="search"
      label="Search rockets"
      density="comfortable"
      variant="outlined"
    />

    <v-btn
      class="mb-4"
      @click="showForm = !showForm"
    >
      {{ showForm ? "Cancel" : "Add Rocket" }}
    </v-btn>

    <v-card v-if="showForm" class="mb-4 pa-4">
      <v-text-field
        v-model="newRocket.name"
        label="Rocket name"
      />
      <v-textarea
        v-model="newRocket.description"
        label="Description"
      />
      <v-btn @click="addRocket">Save</v-btn>
    </v-card>

    <div v-if="loading">Loading rockets...</div>

    <div v-else-if="error">
      <p>{{ error }}</p>
      <v-btn @click="fetchRockets">Retry</v-btn>
    </div>

    <v-card
      v-for="rocket in filteredRockets"
      :key="rocket.id"
      class="mb-4 pa-4 card-clickable"
      style="cursor: pointer"
      @click="!rocket.isLocal && $router.push(`/rocket/${rocket.id}`)"
    >
      <img
        v-if="rocket.flickr_images.length"
        :src="rocket.flickr_images[0]"
        class="rocket-image"
        style="max-width: 100%; margin-bottom: 8px"
      />
      <h3>{{ rocket.name }}</h3>
      <p>{{ rocket.description }}</p>
    </v-card>
  </v-container>
</template>

<style scoped>
.card-clickable {
  cursor: pointer;
}

.rocket-image {
  max-width: 100%;
  margin-bottom: 8px;
}
</style>

