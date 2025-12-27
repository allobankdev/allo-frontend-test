<script setup lang="ts">
import { useRocketStore } from "@/stores/rocket";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useRocketStore();
const loading = ref(true);
const error = ref<string | null>(null);

const rocket = computed(() => {
  return store.getRocketById(route.params.id as string);
});

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (store.rockets.length === 0) {
      await store.fetchRockets();
    }

    if (!rocket.value) {
      error.value = "Rocket not found";
    }
  } catch (err) {
    error.value = "Failed to load rocket data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <v-container class="py-8 h-100">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">
      Back to Rockets
    </v-btn>

    <div v-if="loading" class="d-flex justify-center align-center h-50">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="error">
      <ErrorBanner :errMsg="error" />
    </div>

    <v-fade-transition v-else-if="rocket">
      <v-row>
        <v-col cols="12" md="6">
          <v-carousel
            hide-delimiter-background
            show-arrows="hover"
            height="400"
            class="rounded-lg elevation-4"
          >
            <v-carousel-item
              v-for="(image, i) in rocket.flickr_images"
              :key="i"
              :src="image"
              cover
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary" />
                </v-row>
              </template>
            </v-carousel-item>
            <v-carousel-item
              v-if="rocket.flickr_images.length === 0"
              src="https://via.placeholder.com/600x400?text=No+Images"
              cover
            />
          </v-carousel>
        </v-col>

        <v-col cols="12" md="6">
          <div class="pl-md-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <h1 class="text-h3 font-weight-bold">{{ rocket.name }}</h1>
              <v-chip
                :color="rocket.active ? 'success' : 'warning'"
                variant="elevated"
              >
                {{ rocket.active ? "Active" : "Inactive" }}
              </v-chip>
            </div>

            <div class="text-h6 text-medium-emphasis mb-4">
              {{ rocket.company }} • {{ rocket.country }}
            </div>

            <p class="text-body-1 mb-6 text-justify">
              {{ rocket.description }}
            </p>

            <v-divider class="mb-6" />

            <v-row>
              <v-col cols="6" sm="4">
                <div class="text-caption text-medium-emphasis text-uppercase">
                  First Flight
                </div>
                <div class="text-h6">{{ rocket.first_flight }}</div>
              </v-col>
              <v-col cols="6" sm="4">
                <div class="text-caption text-medium-emphasis text-uppercase">
                  Cost/Launch
                </div>
                <div class="text-h6">
                  ${{ rocket.cost_per_launch.toLocaleString() }}
                </div>
              </v-col>
              <v-col cols="6" sm="4">
                <div class="text-caption text-medium-emphasis text-uppercase">
                  Height
                </div>
                <div class="text-h6">
                  {{ rocket.height.meters }}m / {{ rocket.height.feet }}ft
                </div>
              </v-col>
              <v-col cols="6" sm="4">
                <div class="text-caption text-medium-emphasis text-uppercase">
                  Mass
                </div>
                <div class="text-h6">
                  {{ rocket.mass.kg.toLocaleString() }}kg
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>
