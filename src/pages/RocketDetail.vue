<template>
  <v-container class="rocket-detail-page">
    <!-- Gunakan router.back() dari instance yang sudah dibuat -->
    <v-btn @click="router.back()" class="mb-4" prepend-icon="mdi-arrow-left">
      Back to List
    </v-btn>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-body-1">Loading rocket details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <v-card color="error-lighten-5" class="py-8">
        <v-card-text class="text-center">
          <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
          <h3 class="text-h5 mb-2">Error Loading Rocket</h3>
          <p class="text-body-1 mb-6">{{ error }}</p>
          <v-btn
            color="primary"
            @click="fetchRocket"
            prepend-icon="mdi-refresh"
          >
            Retry
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <!-- Success State -->
    <div v-else-if="rocket">
      <v-card elevation="2" class="rocket-detail-card">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-img
              :src="
                rocket.flickr_images[0] ||
                'https://via.placeholder.com/600x400?text=No+Image'
              "
              height="400"
              cover
              class="detail-image"
            ></v-img>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-chip
                  :color="rocket.active ? 'success' : 'error'"
                  class="mr-2"
                  size="small"
                >
                  {{ rocket.active ? "Active" : "Inactive" }}
                </v-chip>
                <v-chip color="info" class="mr-2" size="small">
                  {{ rocket.country }}
                </v-chip>
              </div>

              <h1 class="text-h4 mb-2">{{ rocket.rocket_name }}</h1>
              <p class="text-subtitle-1 text-grey mb-4">{{ rocket.company }}</p>

              <p class="text-body-1 mb-6">{{ rocket.description }}</p>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="6">
                  <div class="detail-item d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-cash</v-icon>
                    <div>
                      <div class="text-caption text-grey">Cost per Launch</div>
                      <div class="text-h6">
                        ${{ rocket.cost_per_launch.toLocaleString() }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="detail-item d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
                    <div>
                      <div class="text-caption text-grey">First Flight</div>
                      <div class="text-h6">
                        {{ formatDate(rocket.first_flight) }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="detail-item d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-chart-line</v-icon>
                    <div>
                      <div class="text-caption text-grey">Success Rate</div>
                      <div class="text-h6">{{ rocket.success_rate_pct }}%</div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="detail-item d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-rocket</v-icon>
                    <div>
                      <div class="text-caption text-grey">Type</div>
                      <div class="text-h6">{{ rocket.rocket_type }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <div class="mt-6">
                <v-btn
                  :href="rocket.wikipedia"
                  target="_blank"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-wikipedia"
                >
                  Wikipedia
                </v-btn>
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import useRouter
import axios from "axios";

const route = useRoute();
const router = useRouter(); // Inisialisasi router

const rocket = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const rocketId = computed(() => route.params.id as string);

onMounted(() => {
  fetchRocket();
});

const fetchRocket = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(
      `https://api.spacexdata.com/v4/rockets/${rocketId.value}`
    );
    rocket.value = response.data;
  } catch (err) {
    error.value = "Failed to fetch rocket details. Please try again.";
    console.error("Error fetching rocket:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.rocket-detail-page {
  min-height: calc(100vh - 64px);
}

.rocket-detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
