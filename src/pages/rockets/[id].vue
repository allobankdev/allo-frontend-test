<template>
  <v-container>
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      @click="onBack"
    >
      Back
    </v-btn>

    <LoadingState v-if="store.detailLoading" message="Loading rocket detail..." />

    <ErrorState
      v-else-if="store.detailError"
      :message="store.detailError"
      @retry="loadRocket"
    />

    <v-row v-else-if="store.selectedRocket">
      <v-col cols="12" md="6">
        <v-img
          :src="imageUrl"
          height="400"
          cover
          rounded="lg"
        >
          <template #error>
            <v-row
              class="fill-height bg-grey-lighten-3"
              align="center"
              justify="center"
            >
              <v-icon icon="mdi-rocket-launch" size="96" color="grey" />
            </v-row>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ store.selectedRocket.name }}
        </h1>
        <p class="text-body-1 mb-6">{{ store.selectedRocket.description }}</p>

        <v-list>
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-currency-usd" color="primary" />
            </template>
            <v-list-item-title>Cost per Launch</v-list-item-title>
            <v-list-item-subtitle>
              {{ formattedCost }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-earth" color="primary" />
            </template>
            <v-list-item-title>Country</v-list-item-title>
            <v-list-item-subtitle>
              {{ store.selectedRocket.country || "—" }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-calendar" color="primary" />
            </template>
            <v-list-item-title>First Flight</v-list-item-title>
            <v-list-item-subtitle>
              {{ store.selectedRocket.first_flight || "—" }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-check-circle" color="primary" />
            </template>
            <v-list-item-title>Status</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip
                :color="store.selectedRocket.active ? 'success' : 'error'"
                size="small"
              >
                {{ store.selectedRocket.active ? "Active" : "Inactive" }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocket";

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const FALLBACK_IMAGE =
  "https://placehold.co/800x400/EEE/31343C?text=No+Image";

const imageUrl = computed(
  () => store.selectedRocket?.flickr_images?.[0] ?? FALLBACK_IMAGE,
);

const formattedCost = computed(() => {
  const cost = store.selectedRocket?.cost_per_launch;
  if (cost == null) return "—";
  return `$${cost.toLocaleString()}`;
});

function loadRocket() {
  store.fetchRocketById(route.params.id as string);
}

function onBack() {
  // Prefer browser back if there's history, else fallback to list
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}

onMounted(() => {
  loadRocket();
});
</script>
