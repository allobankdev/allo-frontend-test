<template>
  <v-container>
    <!-- LOADING -->
    <v-skeleton-loader v-if="loading" type="image, heading, paragraph" />

    <!-- ERROR -->
    <v-card v-else-if="error" class="pa-6 text-center">
      <v-icon size="48" color="error">mdi-alert-circle</v-icon>

      <h3 class="mt-3">Failed to load rocket</h3>
      <p>{{ error }}</p>

      <v-btn color="primary" @click="fetchRocket"> Retry </v-btn>
    </v-card>

    <!--  SUCCESS -->
    <v-card v-else-if="rocket">
      <v-img :src="rocket.flickr_images[0]" height="300px" cover />

      <v-card-title class="text-h4">
        {{ rocket.name }}
      </v-card-title>

      <v-card-text>
        <p>{{ rocket.description }}</p>

        <v-divider class="my-4" />

        <p><strong>💰 Cost:</strong> {{ rocket.cost_per_launch }}</p>
        <p><strong>🌍 Country:</strong> {{ rocket.country }}</p>
        <p><strong>🚀 First Flight:</strong> {{ rocket.first_flight }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getRocketById } from "@/api/rocket";
import type { TRocket } from "@/types/rocket";

const route = useRoute();

const rocket = ref<TRocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchRocket = async () => {
  loading.value = true;
  error.value = null;

  try {
    rocket.value = await getRocketById(route.params.id as string);
  } catch (err: any) {
    error.value = err?.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRocket);
</script>
