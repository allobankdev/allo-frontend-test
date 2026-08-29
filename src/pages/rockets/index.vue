<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRocketListStore } from "@/stores/rocket-list.store";
import { useRocketListDisplayStore } from "@/stores/rocket-list-display.store";
import { useLocalRocketCrudStore } from "@/stores/locale-rocket-crud.store";

import RocketCard from "@/components/RocketCard.vue";
import SearchRocket from "@/components/SearchRocket.vue";
import CreateRocketForm from "@/components/CreateRocketForm.vue";

import type { DisplayRocket, Rocket } from "@/schema/rocket.schema";

const store = useRocketListStore();
const storeRocketDisplay = useRocketListDisplayStore();
const storeRocketLocale = useLocalRocketCrudStore();

const showCreateModal = ref(false);

const mergeRockets = () => {
  const apiRockets: DisplayRocket[] = store.rockets.map((r) => ({
    sourceType: "API",
    ...r,
  }));

  const localRockets: DisplayRocket[] = storeRocketLocale.rockets.map((r) => ({
    sourceType: "LOCALE",
    ...r,
  }));

  // Merge and remove duplicates by `id`
  const merged = [...apiRockets, ...localRockets].reduce<DisplayRocket[]>(
    (acc, rocket) => {
      if (!acc.find((r) => r.id === rocket.id)) {
        acc.push(rocket);
      }
      return acc;
    },
    [],
  );

  storeRocketDisplay.store(merged);
};

const handleCreateSuccess = (rocket: Rocket) => {
  showCreateModal.value = false;
  store.queryAllRockets();
  storeRocketLocale.findAll();
};

store.$subscribe(() => mergeRockets());
storeRocketLocale.$subscribe(() => mergeRockets());

onMounted(() => {
  store.queryAllRockets();
  storeRocketLocale.findAll();
});

const closeModal = () => {
  showCreateModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">🚀 SpaceX Rockets</h1>
          <p class="mt-2 text-gray-600">
            Explore all rockets developed by SpaceX
          </p>
        </div>

        <!-- Add Rocket Button -->
        <button
          @click="showCreateModal = true"
          class="rounded-xl bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-700"
        >
          + Add Rocket
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4 w-full">
        <SearchRocket />
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-20">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>

      <!-- Error -->
      <div
        v-else-if="store.error"
        class="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow"
      >
        <p class="mb-4 font-medium text-red-600">Failed to load rockets</p>
        <v-btn color="primary" @click="store.queryAllRockets">Retry</v-btn>
      </div>

      <!-- Rocket List -->
      <div v-else>
        <section>
          <div class="grid gap-6 sm:grid-cols-1">
            <RocketCard
              v-for="rocket in storeRocketDisplay.rockets"
              :key="rocket.id"
              :rocket="rocket"
            />
          </div>
        </section>
      </div>
    </div>

    <!-- ================= MODAL ================= -->
    <v-dialog v-model="showCreateModal" max-width="720" persistent>
      <v-card class="rounded-2xl">
        <!-- Header -->
        <v-card-title class="d-flex justify-between align-center">
          <span class="text-h6">Create Rocket</span>
          <v-btn icon="mdi-close" variant="text" @click="closeModal" />
        </v-card-title>

        <v-divider />

        <!-- Content -->
        <v-card-text>
          <CreateRocketForm @create-success="handleCreateSuccess" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
