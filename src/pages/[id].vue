<script setup lang="ts">
import type { Rocket } from "@/stores/rocket";
import { useRocket } from "@/stores/rocket";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute("/[id]");
const rocketStore = useRocket();
const rocket = ref<Rocket | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

onMounted(async () => {
  try {
    rocket.value = await rocketStore.fetchRocketById(String(route.params.id));
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      console.error(error);
    }
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <v-btn
    variant="plain"
    size="small"
    prepend-icon="mdi-arrow-left"
    class="px-0"
    to="/"
  >
    Back to rockets
  </v-btn>

  <v-progress-circular
    v-if="isLoading"
    class="d-flex mx-auto my-16"
    indeterminate
    color="primary"
  ></v-progress-circular>

  <v-card v-else-if="hasError || !rocket" class="mx-auto my-16 pa-8 text-center" max-width="560">
    <v-icon size="56" color="error" class="mb-4">mdi-alert-circle</v-icon>
    <v-card-title>Rocket not found</v-card-title>
    <v-card-text>This rocket is no longer available.</v-card-text>
  </v-card>

  <div v-else class="d-md-flex align-start ga-6 py-6">
    <div class="flex-1-1-100">
      <v-img
        :aspect-ratio="4 / 5"
        class="bg-surface elevation-3 fill-width fill-height"
        :src="rocket.image_url || undefined"
        cover
      ></v-img>
    </div>
    <div class="flex-1-1-100 d-flex flex-column ga-4">
      <div>
        <h1>{{ rocket.full_name || "Unnamed rocket" }}</h1>
        <p>{{ rocket.description || "No description available." }}</p>
      </div>
      <v-row align="center">
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-card-item>
              <v-card-subtitle>country</v-card-subtitle>
            </v-card-item>
            <v-card-text>{{ rocket.manufacturer.country_code || "—" }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-card-item>
              <v-card-subtitle>first flight</v-card-subtitle>
            </v-card-item>
            <v-card-text>{{ rocket.maiden_flight || "—" }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-item>
              <v-card-subtitle>cost per lauch</v-card-subtitle>
            </v-card-item>
            <v-card-text>{{ rocket.launch_cost || "—" }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
