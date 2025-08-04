<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRocketsStore } from "@/stores/rocket";
import type { RocketDetail, RocketResponse } from "@/types/rocket";

const router = useRouter();
const rocketsStore = useRocketsStore();

const showAddDialog = ref(false);
const showSuccessToast = ref(false);
const successMessage = ref("");

onMounted(() => {
  rocketsStore.fetchRockets();
});

const viewRocket = (rocket: RocketResponse) => {
  console.log("Viewing rocket:", rocket);
  router.push(`/rocket/${rocket.id}`);
};

const handleAddRocket = async (rocketData: RocketDetail) => {
  const newRocket: RocketDetail = {
    id: `id_${Math.random().toString(36).substr(2, 5)}`,
    name: rocketData.name,
    description: rocketData.description,
    flickr_images: rocketData.flickr_images || [],
    cost_per_launch: rocketData.cost_per_launch,
    country: rocketData.country,
    first_flight: rocketData.first_flight,
  };

  rocketsStore.addLocalRocket(newRocket);
  showAddDialog.value = false;
  successMessage.value = `Rocket "${rocketData.name}" has been successfully added!`;
  showSuccessToast.value = true;
};

const handleRetry = async () => {
  console.log("Retry button clicked, starting retry...");
  try {
    await rocketsStore.retryRockets();
    console.log("Retry completed successfully");
  } catch (error) {
    console.error("Retry failed:", error);
  }
};
</script>

<template>
  <v-container fluid class="mt-16" max-width="1400px">
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h3 font-weight-bold text-primary">
              SpaceX Rockets
            </h1>
          </div>
          <MainButton
            :modelValue="showAddDialog"
            @update:modelValue="showAddDialog = true"
            prepend-icon="mdi-plus"
          >
            Add Rocket
          </MainButton>
        </div>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="rocketsStore.searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search rockets..."
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="4">
        <Filter v-model="rocketsStore.sortOrder" />
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-row v-if="rocketsStore.error" class="mb-4">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
          @click:close="rocketsStore.clearError"
        >
          <div class="d-flex align-center justify-space-between">
            <span>{{ rocketsStore.error }}</span>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-refresh"
              @click="handleRetry"
              :loading="rocketsStore.loading"
            >
              Retry
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="rocketsStore.loading" class="mb-6">
      <v-col v-for="n in 8" :key="n" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card,text,button" height="320" />
      </v-col>
    </v-row>

    <v-row v-else-if="rocketsStore.filteredRockets.length > 0">
      <v-col
        v-for="rocket in rocketsStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @card-click="viewRocket"
          @view="viewRocket"
        />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else class="mb-6">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-rocket-launch
        </v-icon>
        <h3 class="text-h5 text-grey-darken-1 mb-2">No rockets found</h3>
        <p class="text-body-1 text-grey-darken-2">
          Try adjusting your search or filter criteria
        </p>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
     <v-menu transition="slide-x-reverse-transition">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary" variant="outlined" prepend-icon="mdi-plus">
          Add Rocket
        </v-btn>
      </template>
     </v-menu>
    <AddRocketDialog
      v-model="showAddDialog"
      :loading="rocketsStore.loading"
      @save="handleAddRocket"
    />

    <!-- Success Toast -->
    <v-snackbar
      v-model="showSuccessToast"
      :timeout="3000"
      color="success"
      location="top"
      variant="tonal"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-check-circle</v-icon>
        <span>{{ successMessage }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="showSuccessToast = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
