<template>
  <v-container>
    <!-- Header -->
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 ga-3"
    >
      <div>
        <h1 class="text-h4 font-weight-bold">Rockets</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Explore SpaceX rockets and add your own.
        </p>
      </div>
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="addDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- Filter -->
    <v-text-field
      :model-value="store.searchQuery"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search by name or description..."
      variant="outlined"
      density="comfortable"
      clearable
      hide-details
      class="mb-6"
      @update:model-value="onSearchChange"
    />

    <!-- UI States -->
    <LoadingState
      v-if="store.loading && store.rockets.length === 0"
      message="Loading rockets..."
    />

    <ErrorState
      v-else-if="store.error && store.rockets.length === 0"
      :message="store.error"
      @retry="loadRockets"
    />

    <template v-else>
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" @click="goToDetail" />
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal" class="my-4">
        No rockets found{{
          store.searchQuery ? ` matching "${store.searchQuery}"` : ""
        }}.
      </v-alert>
    </template>

    <!-- Add Rocket Dialog -->
    <AddRocketDialog v-model="addDialogOpen" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocket";

const store = useRocketStore();
const router = useRouter();
const addDialogOpen = ref(false);

function loadRockets() {
  store.fetchRockets();
}

function onSearchChange(value: string | null) {
  store.filterRockets(value ?? "");
}

function goToDetail(id: string) {
  router.push(`/rockets/${id}`);
}

// Lifecycle: only fetch on first visit (preserve cache when navigating back)
onMounted(() => {
  if (store.rockets.length === 0) {
    loadRockets();
  }
});
</script>
