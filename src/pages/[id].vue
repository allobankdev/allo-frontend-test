<template>
  <v-container class="py-5">
    <v-btn @click="$router.push('/')" class="mb-4" variant="tonal">
      ← Back
    </v-btn>

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      border="start"
      variant="tonal"
    >
      Failed to load rocket data.
      <v-btn @click="fetchRocket" text>Retry</v-btn>
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-card v-else-if="rocket" class="mx-auto" max-width="600">
      <v-img
        v-if="rocket.flickr_images?.length"
        :src="rocket.flickr_images[0]"
        height="300px"
      ></v-img>
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-text>
        <p><strong>Description:</strong> {{ rocket.description }}</p>
        <p><strong>Country:</strong> {{ rocket.country }}</p>
        <p><strong>First Flight:</strong> {{ rocket.first_flight }}</p>
        <p>
          <strong>Cost Per Launch:</strong>
          ${{ rocket.cost_per_launch?.toLocaleString() }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

interface Rocket {
  id: string;
  name: string;
  description: string;
  cost_per_launch: number;
  country: string;
  first_flight: string;
  flickr_images: string[];
}

const route = useRoute();
const rocket = ref<Rocket | null>(null);
const loading = ref(true);
const error = ref(false);

const fetchRocket = async () => {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch(
      `https://api.spacexdata.com/v4/rockets/${route.params.id}`
    );
    rocket.value = await res.json();
  } catch {
    error.value = true;
    rocket.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRocket);
</script>

<style scoped>
p {
  margin-bottom: 8px;
}
</style>
