<template>
  <div class="rocket-detail-page">
    <!-- Loading State -->
    <LoadingState
      v-if="loading && !error"
      message="Loading rocket details..."
    />

    <!-- Error State -->
    <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />

    <!-- Rocket Detail Content -->
    <div v-else-if="currentRocket" class="detail-wrapper">
      <div class="hero-and-stats-section">
        <!-- Hero Section -->
        <v-container fluid class="pa-0">
          <v-sheet class="hero-section position-relative">
            <v-img
              :src="heroImage"
              :alt="currentRocket.name"
              height="60vh"
              cover
              gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.7)"
            >
              <div class="hero-content">
                <v-container>
                  <v-btn
                    variant="text"
                    color="white"
                    prepend-icon="mdi-arrow-left"
                    class="mb-4"
                    @click="goBack"
                  >
                    Back to Rockets
                  </v-btn>

                  <h1 class="text-h2 text-white font-weight-bold mb-2">
                    {{ currentRocket.name }}
                  </h1>

                  <div class="d-flex align-center gap-3 mb-4">
                    <v-chip
                      :color="currentRocket.active ? 'success' : 'grey'"
                      variant="elevated"
                      size="large"
                    >
                      {{ currentRocket.active ? "Active" : "Inactive" }}
                    </v-chip>

                    <v-chip color="white" variant="outlined" size="large">
                      {{ currentRocket.type }}
                    </v-chip>
                  </div>

                  <p class="text-h6 text-white opacity-90">
                    {{ currentRocket.company }} • {{ currentRocket.country }}
                  </p>
                </v-container>
              </div>
            </v-img>
          </v-sheet>
        </v-container>

        <v-container class="quick-stats-container">
          <v-row class="ma-0">
            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="stat-card">
                <v-card-text class="text-center pa-4">
                  <v-icon size="40" color="primary" class="mb-2">
                    mdi-currency-usd
                  </v-icon>
                  <div class="text-h5 font-weight-bold">
                    ${{ formatCurrency(currentRocket.cost_per_launch) }}
                  </div>
                  <div class="text-caption text-grey">Cost per Launch</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="stat-card">
                <v-card-text class="text-center pa-4">
                  <v-icon size="40" color="primary" class="mb-2">
                    mdi-calendar
                  </v-icon>
                  <div class="text-h5 font-weight-bold">
                    {{ formatDate(currentRocket.first_flight) }}
                  </div>
                  <div class="text-caption text-grey">First Flight</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="stat-card">
                <v-card-text class="text-center pa-4">
                  <v-icon size="40" color="primary" class="mb-2">
                    mdi-star
                  </v-icon>
                  <div class="text-h5 font-weight-bold">
                    {{ currentRocket.success_rate_pct }}%
                  </div>
                  <div class="text-caption text-grey">Success Rate</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="stat-card">
                <v-card-text class="text-center pa-4">
                  <v-icon size="40" color="primary" class="mb-2">
                    mdi-rocket-launch
                  </v-icon>
                  <div class="text-h5 font-weight-bold">
                    {{ currentRocket.stages }}
                  </div>
                  <div class="text-caption text-grey">Stages</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Scroll Indicator -->
          <div class="scroll-indicator text-center mt-4">
            <v-icon size="32" color="primary" class="bounce-animation">
              mdi-chevron-down
            </v-icon>
            <div class="text-caption text-grey">Scroll for more details</div>
          </div>
        </v-container>
      </div>

      <!-- Scrollable Content Section -->
      <div class="scrollable-content">
        <v-container class="py-6">
          <v-row>
            <!-- Description Section -->
            <v-col cols="12" md="8">
              <v-card class="mb-4" elevation="2">
                <v-card-title class="text-h5 bg-primary text-white">
                  <v-icon start>mdi-information</v-icon>
                  Description
                </v-card-title>
                <v-card-text class="pa-4">
                  <p class="text-body-1">{{ currentRocket.description }}</p>
                </v-card-text>
              </v-card>

              <!-- Specifications -->
              <v-card class="mb-4" elevation="2">
                <v-card-title class="text-h5 bg-primary text-white">
                  <v-icon start>mdi-ruler</v-icon>
                  Specifications
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="spec-item">
                        <div class="text-caption text-grey">Height</div>
                        <div class="text-body-1 font-weight-medium">
                          {{ currentRocket.height.meters }} m /
                          {{ currentRocket.height.feet }} ft
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="spec-item">
                        <div class="text-caption text-grey">Diameter</div>
                        <div class="text-body-1 font-weight-medium">
                          {{ currentRocket.diameter.meters }} m /
                          {{ currentRocket.diameter.feet }} ft
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="spec-item">
                        <div class="text-caption text-grey">Mass</div>
                        <div class="text-body-1 font-weight-medium">
                          {{ formatCurrency(currentRocket.mass.kg) }} kg
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="spec-item">
                        <div class="text-caption text-grey">Engines</div>
                        <div class="text-body-1 font-weight-medium">
                          {{ currentRocket.engines.number }} x
                          {{ currentRocket.engines.type }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Images Gallery -->
              <v-card
                v-if="currentRocket.flickr_images.length > 0"
                elevation="2"
              >
                <v-card-title class="text-h5 bg-primary text-white">
                  <v-icon start>mdi-image-multiple</v-icon>
                  Gallery
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-row>
                    <v-col
                      v-for="(image, index) in currentRocket.flickr_images"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-img
                        :src="image"
                        :alt="`${currentRocket.name} image ${index + 1}`"
                        aspect-ratio="16/9"
                        cover
                        class="rounded cursor-pointer"
                        @click="openImageDialog(image)"
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar Info -->
            <v-col cols="12" md="4">
              <v-card class="mb-4" elevation="2">
                <v-card-title class="text-h6 bg-grey-lighten-4">
                  Additional Information
                </v-card-title>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-flag</v-icon>
                    </template>
                    <v-list-item-title>Country</v-list-item-title>
                    <v-list-item-subtitle>{{
                      currentRocket.country
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-office-building</v-icon>
                    </template>
                    <v-list-item-title>Company</v-list-item-title>
                    <v-list-item-subtitle>{{
                      currentRocket.company
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-layers-triple</v-icon>
                    </template>
                    <v-list-item-title>Stages</v-list-item-title>
                    <v-list-item-subtitle>{{
                      currentRocket.stages
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-rocket</v-icon>
                    </template>
                    <v-list-item-title>Boosters</v-list-item-title>
                    <v-list-item-subtitle>{{
                      currentRocket.boosters
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-recycle</v-icon>
                    </template>
                    <v-list-item-title>First Stage Reusable</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ currentRocket.first_stage.reusable ? "Yes" : "No" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>

              <!-- External Links -->
              <v-card elevation="2">
                <v-card-title class="text-h6 bg-grey-lighten-4">
                  External Links
                </v-card-title>
                <v-card-text class="pa-2">
                  <v-btn
                    v-if="currentRocket.wikipedia"
                    :href="currentRocket.wikipedia"
                    target="_blank"
                    color="primary"
                    variant="outlined"
                    block
                    class="mb-2"
                    prepend-icon="mdi-wikipedia"
                  >
                    Wikipedia
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- Image Dialog -->
    <v-dialog v-model="imageDialog" max-width="1000">
      <v-card>
        <v-card-actions class="justify-end pa-2">
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="imageDialog = false"
          ></v-btn>
        </v-card-actions>
        <v-img :src="selectedImage" :alt="currentRocket?.name"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useRocketStore } from "@/stores/rockets";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();
const { currentRocket, loading, error } = storeToRefs(rocketStore);

const imageDialog = ref(false);
const selectedImage = ref("");

const heroImage = computed(() => {
  if (
    currentRocket.value?.flickr_images &&
    currentRocket.value.flickr_images.length > 0
  ) {
    return currentRocket.value.flickr_images[0];
  }
  return "https://placehold.co/1200x400?text=No+Image+Available";
});

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const openImageDialog = (image: string) => {
  selectedImage.value = image;
  imageDialog.value = true;
};

const goBack = () => {
  router.push({ name: "/" });
};

const retryFetch = async () => {
  rocketStore.clearError();
  await fetchRocketDetail();
};

const fetchRocketDetail = async () => {
  const id = route.params.id as string;
  if (id) {
    try {
      await rocketStore.fetchRocketById(id);
    } catch (err) {
      console.error("Failed to fetch rocket details:", err);
    }
  }
};

onMounted(() => {
  fetchRocketDetail();
});

onUnmounted(() => {
  rocketStore.resetCurrentRocket();
});
</script>

<style scoped>
.rocket-detail-page {
  min-height: 100vh;
  overflow-x: hidden;
}

.detail-wrapper {
  min-height: 100vh;
}

.hero-and-stats-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.hero-section {
  flex: 0 0 60vh;
  position: relative;
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 0;
}

.quick-stats-container {
  flex: 0 0 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 1rem;
}

.stat-card {
  height: 100%;
  display: flex;
  align-items: center;
}

/* Scroll Indicator */
.scroll-indicator {
  margin-top: auto;
  padding-bottom: 1rem;
}

.bounce-animation {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Scrollable Content Section */
.scrollable-content {
  background: black;
  padding-bottom: 2rem;
}

.spec-item {
  padding: 0.5rem 0;
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: scale(1.05);
}

.gap-3 {
  gap: 0.75rem;
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
  .rocket-detail-page {
    height: auto;
  }

  .detail-wrapper {
    min-height: auto;
  }

  .hero-and-stats-section {
    height: auto;
  }

  .hero-section {
    flex: 0 0 auto;
  }

  .quick-stats-container {
    flex: 0 0 auto;
    height: auto;
  }

  .scroll-indicator {
    display: none;
  }
}
</style>
