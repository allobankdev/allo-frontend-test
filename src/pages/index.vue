<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          <v-icon icon="mdi-rocket-launch" class="mr-2" />
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Daftar roket SpaceX dari Launch Library 2 API
        </p>
      </div>
    </div>
    <div class="d-flex justify-end mb-5 mt-8">
      <AddRocketDialog />
    </div>

    <!-- Criteria Filter Bar -->
    <RocketFilter
      v-if="
        !rocketStore.loading &&
        !rocketStore.error &&
        rocketStore.rockets.length > 0
      "
    />

    <!-- Loading State -->
    <LoadingState v-if="rocketStore.loading" message="Memuat daftar roket..." />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.loadRockets()"
    />

    <!-- Success State -->
    <template v-else>
      <!-- Empty Filter State -->
      <v-container
        v-if="rocketStore.filteredRockets.length === 0"
        class="text-center py-12"
      >
        <v-icon color="grey" icon="mdi-filter-off-outline" size="64" />
        <p class="text-body-1 text-medium-emphasis mt-4">
          Tidak ada roket yang cocok dengan kriteria filter yang dipilih.
        </p>
        <v-btn
          v-if="rocketStore.isFilterActive"
          class="mt-4"
          color="primary"
          prepend-icon="mdi-refresh"
          variant="tonal"
          @click="rocketStore.resetFilters()"
        >
          Reset Filter
        </v-btn>
      </v-container>

      <!-- Rocket Grid -->
      <v-row v-else>
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" @click="goToDetail(rocket.id)" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocketStore";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import AddRocketDialog from "@/components/AddRocketDialog.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const rocketStore = useRocketStore();

onMounted(() => {
  // Only fetch if we don't already have data (avoid refetch on back navigation)
  if (rocketStore.rockets.length === 0) {
    rocketStore.loadRockets();
  }
});

function goToDetail(id: number) {
  router.push(`/rockets/${id}`);
}
</script>
