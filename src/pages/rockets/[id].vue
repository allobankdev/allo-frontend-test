<template>
  <v-container class="py-8 h-100">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">
      Back to Rockets
    </v-btn>

    <div v-if="loading" class="d-flex justify-center align-center h-50">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <AppError
      v-else-if="error || !rocket"
      :message="error || 'Rocket not found'"
      @retry="loadData"
    />

    <v-fade-transition v-else>
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
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-carousel-item>
            <v-carousel-item
              v-if="rocket.flickr_images.length === 0"
              src="https://via.placeholder.com/600x400?text=No+Images"
              cover
            ></v-carousel-item>
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

            <v-divider class="mb-6"></v-divider>

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
                  {{ formatCurrency(rocket.cost_per_launch) }}
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

            <v-card
              v-if="rocket.wikipedia"
              class="mt-6"
              variant="tonal"
              color="primary"
              :href="rocket.wikipedia"
              target="_blank"
            >
              <v-card-text class="d-flex align-center">
                <v-icon icon="mdi-wikipedia" class="mr-2"></v-icon>
                Read more on Wikipedia
                <v-icon
                  icon="mdi-open-in-new"
                  size="small"
                  class="ml-auto"
                ></v-icon>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocket";
import AppError from "@/components/AppError.vue";

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

  if (store.rockets.length > 0) {
    if (!rocket.value) {
      error.value = "Rocket not found in loaded data.";
    }
    loading.value = false;
    return;
  }

  await store.fetchRockets();

  if (store.error) {
    error.value = store.error;
  } else if (!rocket.value) {
    error.value = "Rocket not found";
  }
  loading.value = false;
};

onMounted(() => {
  loadData();
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(value);
};
</script>
