<template>
  <v-container class="py-8 py-md-12">
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-8"
    >
      Back to Catalogue
    </v-btn>

    <!-- Loading -->
    <div
      v-if="loading"
      class="state-container"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <p class="text-body-1 text-medium-emphasis mt-4">
        Loading rocket details...
      </p>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      rounded="lg"
    >
      <div class="font-weight-bold mb-2">
        Unable to load rocket details
      </div>

      <p class="mb-4">
        {{ error }}
      </p>

      <v-btn
        color="error"
        variant="flat"
        @click="loadRocket"
      >
        Try Again
      </v-btn>
    </v-alert>

    <!-- Rocket not found -->
    <v-alert
      v-else-if="!rocket"
      type="warning"
      variant="tonal"
      rounded="lg"
    >
      Rocket not found.
    </v-alert>

    <!-- Rocket details -->
    <div v-else>
      <v-row>
        <v-col
          cols="12"
          lg="7"
        >
          <RocketImage
            :src="rocket.imageUrl"
            :alt="rocket.name"
            :height="420"
            :icon-size="80"
            rounded="xl"
          />
        </v-col>

        <v-col
          cols="12"
          lg="5"
        >
          <div class="d-flex align-center ga-2 mb-4">
            <v-chip
              color="primary"
              variant="tonal"
              size="small"
            >
              {{ rocket.isCustom ? "Custom Rocket" : "SpaceX Rocket" }}
            </v-chip>
          </div>

          <h1 class="text-h3 font-weight-bold mb-5">
            {{ rocket.name }}
          </h1>

          <p class="text-body-1 text-medium-emphasis detail-description">
            {{
              rocket.description || "No description available for this rocket."
            }}
          </p>

          <v-divider class="my-8" />

          <h2 class="text-h6 font-weight-bold mb-5">
            Rocket Information
          </h2>

          <div class="detail-info">
            <div class="info-item">
              <v-icon
                icon="mdi-currency-usd"
                color="primary"
              />
              <div>
                <div class="text-caption text-medium-emphasis">
                  Cost per Launch
                </div>
                <div class="font-weight-medium">
                  {{ formatLaunchCost(rocket.launchCost) }}
                </div>
              </div>
            </div>

            <div class="info-item">
              <v-icon
                icon="mdi-earth"
                color="primary"
              />
              <div>
                <div class="text-caption text-medium-emphasis">
                  Country
                </div>
                <div class="font-weight-medium">
                  {{ rocket.country || "Not available" }}
                </div>
              </div>
            </div>

            <div class="info-item">
              <v-icon
                icon="mdi-calendar"
                color="primary"
              />
              <div>
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="font-weight-medium">
                  {{ formatDate(rocket.firstFlight) }}
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getRocketById } from "@/services/rocketService";
import {
  CUSTOM_ROCKET_ID_PREFIX,
  useRockets,
} from "@/composables/useRockets";
import { formatDate, formatLaunchCost } from "@/utils/format";
import type { Rocket } from "@/types/rocket";

const route = useRoute();
const { findRocketById } = useRockets();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Ignores responses of outdated requests (e.g. fast navigation between rockets).
let latestRequestId = 0;

async function loadRocket() {
  const id = String(route.params.id);
  const requestId = ++latestRequestId;

  loading.value = true;
  error.value = null;
  rocket.value = null;

  try {
    // Use existing client state first, including custom rockets.
    const existingRocket = findRocketById(id);

    if (existingRocket) {
      rocket.value = existingRocket;
      return;
    }

    // Custom rockets are lost on reload and do not exist on the API.
    if (id.startsWith(CUSTOM_ROCKET_ID_PREFIX)) {
      return;
    }

    // Fetch from API when the rocket is not in client state.
    const fetchedRocket = await getRocketById(id);

    if (requestId === latestRequestId) {
      rocket.value = fetchedRocket;
    }
  } catch (err) {
    if (requestId === latestRequestId) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred.";
    }
  } finally {
    if (requestId === latestRequestId) {
      loading.value = false;
    }
  }
}

watch(
  () => route.params.id,
  () => loadRocket(),
  { immediate: true },
);
</script>

<style scoped>
.state-container {
  display: flex;
  min-height: 350px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-description {
  line-height: 1.8;
  white-space: pre-line;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
