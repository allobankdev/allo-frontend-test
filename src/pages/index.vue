<template>
  <v-container class="py-8">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold">SpaceX Rockets</h1>

      <p class="text-body-1 text-medium-emphasis my-4">
        Explore the SpaceX rocket collection.
      </p>
      <AddRocketDialog
        v-if="store.status === 'success'"
        @add="handleAddRocket"
      />
    </div>
    <div class="my-4">
      <RocketFilter v-model="searchQuery" />
    </div>

    <div class="my-2 text-body-2 text-medium-emphasis">
      {{ filteredRockets.length }}
      {{ filteredRockets.length === 1 ? "rocket" : "rockets" }}
      found
    </div>

    <RocketLoadingState v-if="store.status === 'loading'" />

    <RocketErrorState
      v-else-if="store.status === 'error'"
      :message="store.error ?? 'Something went wrong.'"
      @retry="loadRockets"
    />

    <RocketEmptyState
      v-else-if="store.status === 'success' && filteredRockets.length === 0"
    />

    <RocketGrid
      v-else-if="store.status === 'success'"
      :rockets="filteredRockets"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRocketStore } from "@/stores/rocket.store";
import type { Rocket } from "@/types/rocket";

const store = useRocketStore();

const searchQuery = ref("");

const filteredRockets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return store.rockets;
  }

  return store.rockets.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(query),
  );
});

function loadRockets() {
  if (store.status === "success") {
    return;
  }
  store.fetchRockets();
}

function handleAddRocket(rocket: Omit<Rocket, "id">) {
  store.addRocket(rocket);
}

onMounted(() => {
  loadRockets();
});
</script>
