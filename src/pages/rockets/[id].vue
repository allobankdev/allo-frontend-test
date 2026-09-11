<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 px-0"
      to="/"
    >
      Back to rockets
    </v-btn>

    <AppLoading v-if="loading" message="Loading rocket details..." />

    <AppError v-else-if="error" :message="error" @retry="loadRocket" />

    <AppEmptyState
      v-else-if="notFound"
      icon="mdi-rocket-outline"
      title="Rocket not found"
      message="The rocket you're looking for doesn't exist."
    />

    <v-row v-else-if="rocket" align="start" class="ga-md-4">
      <v-col cols="12" md="5">
        <div class="image-wrapper">
          <v-img
            v-if="rocket.image_url && !imageError"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            height="500"
            cover
            class="rocket-image"
            @error="imageError = true"
          />

          <div v-else class="image-placeholder">
            <v-icon icon="mdi-rocket-launch" size="96" />
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="detail-content">
          <div class="mb-6">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="mdi-rocket-launch" color="primary" size="20" />

              <span class="text-overline text-primary font-weight-bold">
                ROCKET DETAILS
              </span>
            </div>

            <h1 class="text-h3 font-weight-bold mb-4">
              {{ rocket.full_name }}
            </h1>

            <p class="text-body-1 text-medium-emphasis description">
              {{ rocket.description || "Description unavailable." }}
            </p>
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <v-card variant="outlined" rounded="lg" height="100%">
                <v-card-text>
                  <v-icon
                    icon="mdi-cash"
                    color="primary"
                    size="28"
                    class="mb-4"
                  />

                  <div class="text-caption text-medium-emphasis mb-1">
                    COST PER LAUNCH
                  </div>

                  <div class="text-h6 font-weight-bold">
                    {{ formatCurrency(rocket.launch_cost) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4">
              <v-card variant="outlined" rounded="lg" height="100%">
                <v-card-text>
                  <v-icon
                    icon="mdi-earth"
                    color="primary"
                    size="28"
                    class="mb-4"
                  />

                  <div class="text-caption text-medium-emphasis mb-1">
                    COUNTRY
                  </div>

                  <div class="text-h6 font-weight-bold">
                    {{ rocket.manufacturer?.country_code || "Not available" }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4">
              <v-card variant="outlined" rounded="lg" height="100%">
                <v-card-text>
                  <v-icon
                    icon="mdi-calendar"
                    color="primary"
                    size="28"
                    class="mb-4"
                  />

                  <div class="text-caption text-medium-emphasis mb-1">
                    FIRST FLIGHT
                  </div>

                  <div class="text-h6 font-weight-bold">
                    {{ formatDate(rocket.maiden_flight) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { getRocketById } from "@/api/rockets.api";
import { useRocketStore } from "@/stores/rocket";
import type { Rocket } from "@/types/rocket";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

import AppError from "@/components/common/AppError.vue";
import AppLoading from "@/components/common/AppLoading.vue";
import AppEmptyState from "@/components/common/AppEmptyState.vue";

const route = useRoute();

const rocketStore = useRocketStore();

const rocket = ref<Rocket | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);
const imageError = ref(false);
const notFound = ref(false);

async function loadRocket() {
  loading.value = true;
  error.value = null;
  notFound.value = false;
  imageError.value = false;

  try {
    const id = String(route.params.id);

    const storedRocket = rocketStore.allRockets.find(
      (item) => String(item.id) === id,
    );

    if (storedRocket) {
      rocket.value = storedRocket;
      return;
    }

    rocket.value = await getRocketById(id);
  } catch (err) {
    console.error("Failed to load rocket:", err);

    if (err instanceof Error && err.message.includes("404")) {
      notFound.value = true;
      rocket.value = null;
      return;
    }

    error.value = "Failed to load rocket detail. Please try again.";
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  loadRocket();
});
</script>

<style scoped>
.image-wrapper {
  width: 100%;
}

.rocket-image,
.image-placeholder {
  width: 100%;
  height: 500px;
  border-radius: 16px;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.detail-content {
  padding: 8px 0;
}

.description {
  line-height: 1.8;
  max-width: 720px;
}

@media (max-width: 959px) {
  .rocket-image,
  .image-placeholder {
    height: 360px;
  }
}
</style>
