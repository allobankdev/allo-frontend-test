<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketsStore } from "@/stores/rocket";
import type { RocketDetail } from "@/types/rocket";

const route = useRoute();
const rocketsStore = useRocketsStore();

const rocket = ref<RocketDetail | null>(null);
const currentImageIndex = ref(0);

const retryRocket = async () => {
  const rocketId = route.params.id as string;
  if (rocketId) {
    const fetchedRocket = await rocketsStore.retryRocket(rocketId);
    if (fetchedRocket) {
      rocket.value = fetchedRocket;
    }
  }
};

onMounted(async () => {
  const rocketId = route.params.id as string;
  if (rocketId) {
    if (rocketId.startsWith("local_")) {
    }

    const fetchedRocket = await rocketsStore.fetchRocket(rocketId);
    if (fetchedRocket) {
      rocket.value = fetchedRocket;
    } else {
      if (rocketId.startsWith("local_")) {
        rocketsStore.error =
          "Local rocket not found. It may have been deleted.";
      }
    }
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};
</script>
<template>
  <v-container fluid class="mt-16" max-width="1400px">
    <v-row class="mb-4">
      <v-col cols="12">
        <MainButton prepend-icon="mdi-arrow-left" @click="$router.back()"
          >Back to Rockets</MainButton
        >
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="rocketsStore.loading" class="mb-6 mt-16">
      <v-col cols="12" class="mb-6">
        <v-skeleton-loader type="heading" class="mb-4" width="400" />
        <v-card class="mb-6">
          <v-card-title>
            <v-skeleton-loader type="text" width="100" />
          </v-card-title>
          <v-skeleton-loader type="image" height="400" />
          <v-card-title>
            <v-skeleton-loader type="text" width="150" />
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader type="paragraph" />
          </v-card-text>
          <v-card-title>
            <v-skeleton-loader type="text" width="200" />
          </v-card-title>
          <v-list class="d-flex justify-lg-space-between pr-16">
            <v-list-item v-for="n in 3" :key="n">
              <template v-slot:prepend>
                <v-skeleton-loader type="avatar" />
              </template>
              <v-list-item-title>
                <v-skeleton-loader type="text" width="120" />
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-skeleton-loader type="text" width="80" />
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="rocketsStore.error" class="mb-4">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
          @click:close="rocketsStore.clearError"
        >
          <div class="d-flex align-center justify-space-between">
            <span>{{ rocketsStore.error }}</span>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-refresh"
              @click="retryRocket"
              :loading="rocketsStore.loading"
            >
              Retry
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="rocket">
      <v-col cols="12" class="mb-6">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h3 font-weight-bold text-primary">
              {{ rocket.name }}
            </h1>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <v-card class="mb-6">
          <!-- Images Section - Only show if images exist -->
          <div v-if="rocket.flickr_images.length > 0">
            <v-card-title>Images</v-card-title>
            <v-carousel
              v-model="currentImageIndex"
              show-arrows="hover"
              height="400"
            >
              <v-carousel-item
                v-for="(image, index) in rocket.flickr_images"
                :key="index"
                :src="image"
                cover
              />
            </v-carousel>
          </div>

          <!-- No Images Message -->
          <div v-else class="pa-6 text-center">
            <v-img
              src="https://placehold.co/600x400"
              height="400"
              cover
              class="mb-4"
            />
          </div>

          <v-card-title>Description</v-card-title>
          <v-card-text>
            <p class="text-body-1">{{ rocket.description }}</p>
          </v-card-text>
          <v-card-title>Detail Information</v-card-title>
          <v-list class="d-flex justify-lg-space-between pr-16">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-currency-usd</v-icon>
              </template>
              <v-list-item-title>Cost per Launch</v-list-item-title>
              <v-list-item-subtitle>
                ${{ rocket.cost_per_launch.toLocaleString() }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-flag</v-icon>
              </template>
              <v-list-item-title>Country</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="d-flex justify-between gap-16">
              <template v-slot:prepend>
                <v-icon>mdi-calendar</v-icon>
              </template>
              <v-list-item-title>First Flight</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(rocket.first_flight) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
