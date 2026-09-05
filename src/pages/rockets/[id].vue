<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router/auto";

import { getRocketById } from "@/services/rocketApi";
import { useRocketStore } from "@/stores/rocket";
import type { Rocket } from "@/types/rocket";

const route = useRoute("/rockets/[id]");
const rocketStore = useRocketStore();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const routeId = computed(() => {
  const params = route.params;

  return "id" in params ? String(params.id) : "";
});

function formatCost(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  const cost = Number(value);

  if (!Number.isFinite(cost)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cost);
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(date);
}

async function loadRocket(): Promise<void> {
  const id = routeId.value;

  if (!id) {
    rocket.value = null;
    error.value = "Rocket ID is missing.";
    return;
  }

  const cachedRocket = rocketStore.findRocketById(id);

  rocket.value = cachedRocket ?? null;
  error.value = null;

  if (cachedRocket?.isLocal) {
    return;
  }

  if (id.startsWith("local-")) {
    error.value = "This locally added rocket is no longer available.";
    return;
  }

  loading.value = true;

  try {
    rocket.value = await getRocketById(id);
  } catch (exception) {
    if (!rocket.value) {
      error.value =
        exception instanceof Error
          ? exception.message
          : "Unable to load rocket details";
    }
  } finally {
    loading.value = false;
  }
}

watch(
  routeId,
  () => {
    void loadRocket();
  },
  { immediate: true },
);
</script>

<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-container class="d-flex align-center">
        <v-btn
          aria-label="Back to rocket list"
          icon="mdi-arrow-left"
          to="/"
          variant="text"
        />

        <v-app-bar-title>Rocket Details</v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <v-card v-if="loading && !rocket">
          <v-skeleton-loader type="image, article, actions" />
        </v-card>

        <v-alert
          v-else-if="error"
          title="Unable to load rocket"
          type="error"
          variant="tonal"
        >
          <p class="mb-4">
            {{ error }}
          </p>

          <div class="d-flex ga-3">
            <v-btn
              to="/"
              variant="outlined"
            >
              Back to list
            </v-btn>

            <v-btn
              color="error"
              prepend-icon="mdi-refresh"
              variant="flat"
              @click="loadRocket"
            >
              Retry
            </v-btn>
          </div>
        </v-alert>

        <v-card
          v-else-if="rocket"
          elevation="2"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
            >
              <v-img
                v-if="rocket.image_url"
                :alt="rocket.full_name || 'Rocket image'"
                :src="rocket.image_url"
                cover
                height="100%"
                min-height="380"
              >
                <template #error>
                  <div class="image-placeholder">
                    <v-icon
                      icon="mdi-rocket-launch"
                      size="96"
                    />
                  </div>
                </template>
              </v-img>

              <div
                v-else
                class="image-placeholder"
              >
                <v-icon
                  icon="mdi-rocket-launch"
                  size="96"
                />
              </div>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-card-item>
                <v-card-title class="text-h4">
                  {{ rocket.full_name || "Unnamed rocket" }}
                </v-card-title>

                <v-chip
                  v-if="rocket.isLocal"
                  class="mt-2"
                  color="primary"
                  size="small"
                >
                  Locally added
                </v-chip>
              </v-card-item>

              <v-card-text>
                <p class="mb-6">
                  {{ rocket.description || "No description available." }}
                </p>

                <v-list lines="two">
                  <v-list-item
                    prepend-icon="mdi-cash"
                    subtitle="Cost per launch"
                    :title="formatCost(rocket.launch_cost)"
                  />

                  <v-list-item
                    prepend-icon="mdi-earth"
                    subtitle="Country"
                    :title="
                      rocket.manufacturer?.country_code || 'Not available'
                    "
                  />

                  <v-list-item
                    prepend-icon="mdi-calendar"
                    subtitle="First flight"
                    :title="formatDate(rocket.maiden_flight)"
                  />
                </v-list>
              </v-card-text>

              <v-card-actions class="px-4 pb-4">
                <v-spacer />

                <v-btn
                  prepend-icon="mdi-close"
                  to="/"
                  variant="outlined"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.image-placeholder {
  align-items: center;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  display: flex;
  min-height: 380px;
  justify-content: center;
}
</style>
