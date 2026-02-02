<template>
  <div class="rocket-list-page">
    <!-- Header Section -->
    <v-container fluid class="pa-0">
      <v-sheet color="primary" class="">
        <v-container>
          <h1 class="text-h3 text-white font-weight-bold mb-2">
            SpaceX Rockets
          </h1>
          <p class="text-h6 text-white opacity-90">
            Explore the fleet of SpaceX rockets
          </p>
        </v-container>
      </v-sheet>
    </v-container>

    <v-container>
      <!-- Filters and Actions -->
      <v-card elevation="1">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="5">
              <v-text-field
                v-model="searchQuery"
                label="Search rockets"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details
                @update:model-value="handleSearch"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="filterStatus"
                :items="filterOptions"
                label="Filter by status"
                variant="outlined"
                density="comfortable"
                hide-details
                @update:model-value="handleFilter"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3" class="text-right">
              <AddRocketDialog />
            </v-col>
          </v-row>

          <!-- Results Info -->
          <v-row class="mt-2">
            <v-col cols="12">
              <div class="text-caption text-grey">
                Showing {{ filteredRockets.length }} of
                {{ rockets.length }} rockets
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Loading State -->
      <LoadingState v-if="loading && !error" message="Loading rockets..." />

      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />

      <!-- Empty State -->
      <EmptyState
        v-else-if="!loading && rockets.length === 0"
        title="No Rockets Found"
        message="Try adjusting your search or filter criteria."
        icon="mdi-rocket"
      />

      <!-- Rockets Carousel for Desktop -->
      <div v-else class="rockets-container">
        <!-- Desktop View - Carousel -->
        <div class="d-none d-md-block">
          <v-carousel
            v-model="carouselModel"
            hide-delimiters
            :show-arrows="rockets.length > 4"
            height="auto"
            class="rocket-carousel"
          >
            <template v-slot:prev="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                size="large"
                class="carousel-nav-btn"
              />
            </template>

            <template v-slot:next="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                size="large"
                class="carousel-nav-btn"
              />
            </template>

            <v-carousel-item
              v-for="(slide, index) in carouselSlides"
              :key="index"
            >
              <v-row class="ma-0">
                <v-col
                  v-for="rocket in slide"
                  :key="rocket.id"
                  cols="3"
                  class="pa-2"
                >
                  <RocketCard :rocket="rocket" />
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </div>

        <!-- Mobile View - Grid -->
        <v-row class="d-md-none">
          <v-col v-for="rocket in rockets" :key="rocket.id" cols="12" sm="6">
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRocketStore } from "@/stores/rockets";
import AddRocketDialog from "@/components/AddRocketDialogue.vue";
import RocketCard from "@/components/RocketCard.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";
import EmptyState from "@/components/EmptyState.vue";
import type { Rocket } from "@/types/rocket";

const rocketStore = useRocketStore();
const { rockets, filteredRockets, loading, error } = storeToRefs(rocketStore);

const carouselModel = ref(0);

const carouselSlides = computed(() => {
  const slides: Rocket[][] = [];
  const itemsPerSlide = 4;

  for (let i = 0; i < filteredRockets.value.length; i += itemsPerSlide) {
    slides.push(filteredRockets.value.slice(i, i + itemsPerSlide));
  }

  return slides;
});

const searchQuery = ref("");
const filterStatus = ref("all");

const filterOptions = [
  { title: "All Rockets", value: "all" },
  { title: "Active Only", value: "active" },
  { title: "Inactive Only", value: "inactive" },
];

const handleSearch = (query: string | null) => {
  rocketStore.setSearchQuery(query || "");
};

const handleFilter = (value: string) => {
  if (value === "active") {
    rocketStore.setFilter(true);
  } else if (value === "inactive") {
    rocketStore.setFilter(false);
  } else {
    rocketStore.setFilter(null);
  }
};

const retryFetch = async () => {
  rocketStore.clearError();
  await fetchRockets();
};

const fetchRockets = async () => {
  try {
    await rocketStore.fetchRockets();
  } catch (err) {
    console.error("Failed to fetch rockets:", err);
  }
};

onMounted(() => {
  fetchRockets();
});
</script>

<style scoped>
.rocket-list-page {
  min-height: 100vh;
}

.rocket-carousel {
  background: transparent !important;
}

.rocket-carousel :deep(.v-window__container) {
  padding: 0 50px;
}

.carousel-nav-btn {
  z-index: 2;
}

/* Ensure cards don't overflow */
.rocket-carousel :deep(.v-carousel-item) {
  display: flex;
  align-items: center;
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .rocket-list-page {
    overflow: auto;
  }
}
</style>
