<template>
  <v-container class="rocket-list-page">
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold">
          <v-icon class="mr-2">mdi-rocket-launch</v-icon>
          SpaceX Rockets
        </h1>
        <v-btn color="primary" @click="showForm = true" prepend-icon="mdi-plus">
          Add New Rocket
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Filter Sidebar -->
      <v-col cols="12" md="3">
        <RocketFilter
          v-model="filters"
          :available-countries="store.uniqueCountries"
          @clear="handleClearFilters"
        />
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" md="9">
        <!-- Search Input -->
        <v-text-field
          v-model="filters.search"
          label="Search rockets..."
          placeholder="Search by name or description"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
        ></v-text-field>

        <!-- Loading State -->
        <LoadingSpinner
          v-if="store.loading && store.rockets.length === 0"
          message="Loading rockets from SpaceX..."
        />

        <!-- Error State -->
        <ErrorDisplay
          v-else-if="store.error"
          :title="'Failed to Load Rockets'"
          :message="store.error"
          @retry="fetchRockets"
        />

        <!-- Success State -->
        <template v-else>
          <v-alert
            v-if="store.filteredRockets.length === 0 && !store.loading"
            type="info"
            class="mb-4"
          >
            No rockets found. Try adjusting your filters.
          </v-alert>

          <v-row v-if="store.filteredRockets.length > 0">
            <v-col
              v-for="rocket in store.filteredRockets"
              :key="rocket.id"
              cols="12"
              sm="6"
              lg="4"
            >
              <RocketCard
                :rocket="rocket"
                @click="goToRocketDetail(rocket.id)"
              />
            </v-col>
          </v-row>

          <!-- Stats -->
          <v-card v-if="store.rockets.length > 0" class="mt-6">
            <v-card-text>
              <div class="d-flex justify-space-between">
                <span>Total Rockets: {{ store.rockets.length }}</span>
                <span>Filtered: {{ store.filteredRockets.length }}</span>
                <span>Active: {{ activeRocketCount }}</span>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog v-model="showForm" max-width="600" persistent>
      <RocketForm @submit="handleAddRocket" @cancel="showForm = false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "../stores/rocketStore";
import type { RocketFilters, CreateRocketDto } from "../types/rocket";
import RocketCard from "../components/RocketCard.vue";
import RocketFilter from "../components/RocketFilter.vue";
import RocketForm from "../components/RocketForm.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";

const router = useRouter();
const store = useRocketStore();

const showForm = ref(false);
const filters = ref<RocketFilters>({
  active: null,
  country: "",
  search: "",
});

// Computed
const activeRocketCount = computed(() => {
  return store.rockets.filter((rocket) => rocket.active).length;
});

// Watch filters and update store
watch(
  filters,
  (newFilters) => {
    store.setFilters(newFilters);
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  fetchRockets();
});

// Methods
const fetchRockets = async () => {
  try {
    await store.fetchRockets();
  } catch (error) {
    console.error("Failed to fetch rockets:", error);
  }
};

const goToRocketDetail = (rocketId: string) => {
  router.push(`/rocket/${rocketId}`);
};

const handleClearFilters = () => {
  filters.value = {
    active: null,
    country: "",
    search: "",
  };
};

const handleAddRocket = async (rocketData: CreateRocketDto) => {
  try {
    await store.addRocket(rocketData);
    showForm.value = false;

    // Show success toast/snackbar
    alert("Rocket added successfully!");

    // Refresh list jika perlu
    if (store.rockets.length === 0) {
      await store.fetchRockets();
    }
  } catch (error) {
    console.error("Failed to add rocket:", error);
    // Bisa tambah error toast di sini
  }
};
</script>

<style scoped>
.rocket-list-page {
  min-height: calc(100vh - 64px);
}
</style>
