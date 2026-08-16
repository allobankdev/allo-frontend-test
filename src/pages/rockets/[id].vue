<template>
  <v-container class="py-8 rocket-detail">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 rocket-detail__back"
      @click="goBack"
    >
      Back to rockets
    </v-btn>

    <RocketLoadingState v-if="store.detailStatus === 'loading'" />

    <RocketErrorState
      v-else-if="store.detailStatus === 'error'"
      :message="store.detailError ?? 'Something went wrong.'"
      @retry="loadRocket"
    />

    <v-alert v-else-if="!rocket" type="warning" variant="tonal">
      <v-alert-title> Rocket not found </v-alert-title>

      <p class="mt-2">The requested rocket could not be found.</p>
    </v-alert>

    <v-card v-else class="rocket-detail__card">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.image_url ?? undefined"
            :alt="rocket.full_name"
            :height="imageHeight"
            cover
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-rocket-outline" size="80" />
              </div>
            </template>

            <template #error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-image-off-outline" size="80" />
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="6">
          <v-card-item class="pa-4 pa-sm-5 pa-md-6">
            <v-card-title class="text-h5 text-md-h4 text-wrap px-0">
              {{ rocket.full_name }}
            </v-card-title>

            <v-card-text class="px-0 mt-4">
              <p class="text-body-2 text-md-body-1 rocket-detail__description">
                {{ rocket.description || "No description available." }}
              </p>
            </v-card-text>
          </v-card-item>

          <v-divider />

          <v-list lines="two">
            <v-list-item
              title="Cost per launch"
              :subtitle="formatLaunchCost(rocket.launch_cost)"
              prepend-icon="mdi-cash-multiple"
            />

            <v-list-item
              title="Country"
              :subtitle="rocket.manufacturer?.country_code || 'Not available'"
              prepend-icon="mdi-earth"
            />

            <v-list-item
              title="First flight"
              :subtitle="formatDate(rocket.maiden_flight)"
              prepend-icon="mdi-calendar"
            />
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useRocketStore } from "@/stores/rocket.store";
import type { Rocket } from "@/types/rocket";

const route = useRoute("/rockets/[id]");
const router = useRouter();
const store = useRocketStore();

const { mobile, mdAndUp } = useDisplay();

const rocket = ref<Rocket | null>(null);

// Height driven by Vuetify's own breakpoints instead of a CSS override,
// so v-img's inline style never needs to be fought with !important.
const imageHeight = computed(() => {
  if (mobile.value) return 240;
  if (mdAndUp.value) return 480;
  return 360;
});

async function loadRocket() {
  const id = String(route.params.id);

  rocket.value = await store.fetchRocketById(id);
}

function goBack() {
  router.push("/");
}

function formatLaunchCost(cost: number | null) {
  if (cost === null) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cost);
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(parsedDate);
}

onMounted(() => {
  loadRocket();
});
</script>

<style scoped>
.rocket-detail {
  max-width: 1000px;
}

.rocket-detail__back {
  font-weight: 600;
}

.rocket-detail__card {
  overflow: hidden;
  border-radius: 16px;
}

.rocket-detail__description {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}
</style>
