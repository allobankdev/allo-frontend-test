<template>
  <v-container class="py-8 py-md-12">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-6"
      @click="goBack"
    >
      Back to rockets
    </v-btn>

    <div v-if="loading" class="d-flex flex-column align-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4">Loading rocket details...</p>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      <p>{{ error }}</p>
      <div class="d-flex ga-2 mt-3">
        <v-btn color="error" @click="loadDetail"> Retry </v-btn>
        <v-btn variant="text" @click="goBack"> Back </v-btn>
      </div>
    </v-alert>

    <template v-else-if="rocket">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.image_url || undefined"
            :alt="rocket.full_name"
            height="400"
            rounded="xl"
            cover
            class="detail-image"
          >
            <template #placeholder>
              <div class="image-fallback">
                <v-icon icon="mdi-rocket-launch" size="64" />
                <span>Image unavailable</span>
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-overline text-primary">ROCKET DETAILS</div>

          <h1 class="text-h3 font-weight-bold mb-4">
            {{ rocket.full_name || "Unnamed rocket" }}
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-8">
            {{ rocket.description || "No description available." }}
          </p>

          <v-card rounded="xl" variant="outlined">
            <v-list>
              <v-list-item
                prepend-icon="mdi-currency-usd"
                title="Cost per launch"
                :subtitle="formatCost(rocket.launch_cost)"
              />

              <v-divider />

              <v-list-item
                prepend-icon="mdi-earth"
                title="Country"
                :subtitle="rocket.manufacturer?.country_code || 'Not available'"
              />

              <v-divider />

              <v-list-item
                prepend-icon="mdi-calendar"
                title="First flight"
                :subtitle="formatDate(rocket.maiden_flight)"
              />
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRockets } from "@/composables/useRockets";
import { getRocketById } from "@/services/rocketService";
import type { Rocket } from "@/types/rocket";

const route = useRoute();
const router = useRouter();
const { findRocket } = useRockets();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

let requestId = 0;

function formatCost(cost: number | null | undefined): string {
  if (cost == null || !Number.isFinite(cost)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cost);
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}

async function loadDetail() {
  const currentRequest = ++requestId;
  const id = String(route.params.id);

  error.value = null;
  loading.value = true;

  try {
    // Use shared state first to avoid an unnecessary API request.
    const cachedRocket = findRocket(id);

    rocket.value = cachedRocket ?? (await getRocketById(id));

    if (currentRequest !== requestId) return;
  } catch (err: unknown) {
    if (currentRequest !== requestId) return;

    const message = err instanceof Error ? err.message : "";

    if (message.includes("404")) {
      error.value =
        "Rocket not found. It may not exist or may have been removed.";
    } else {
      error.value =
        message || "Unable to load rocket details. Please try again.";
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false;
    }
  }
}

onMounted(loadDetail);

watch(() => route.params.id, loadDetail);
</script>

<style scoped>
.detail-image {
  background: #f3f4f6;
}

.image-fallback {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6b7280;
}
</style>
