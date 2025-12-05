<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="6"
      />
      <div class="mt-4 text-h6">
        Loading rocket details...
      </div>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="mb-4"
    >
      <div class="d-flex justify-space-between align-center">
        <div>{{ error }}</div>
        <v-btn 
          color="error" 
          variant="tonal" 
          prepend-icon="mdi-refresh"
          @click="fetchRocket"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Success State -->
    <div v-else-if="rocket">
      <!-- Back Button -->
      <v-btn 
        color="primary" 
        variant="text" 
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.push('/')"
      >
        Back to Rockets
      </v-btn>

      <!-- Rocket Header -->
      <v-card
        class="mb-6"
        color="primary"
        dark
      >
        <v-img
          :src="rocketImage"
          height="300"
          cover
          gradient="to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)"
          class="d-flex align-end"
        >
          <v-card-title class="text-h3 font-weight-bold pa-6">
            {{ rocket.name }}
            <v-chip 
              class="ml-4" 
              :color="rocket.active ? 'green' : 'grey'"
              size="large"
            >
              <v-icon start>
                {{ rocket.active ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ rocket.active ? 'ACTIVE' : 'INACTIVE' }}
            </v-chip>
          </v-card-title>
        </v-img>
      </v-card>

      <!-- Main Content -->
      <v-row>
        <!-- Left Column: Details -->
        <v-col
          cols="12"
          md="8"
        >
          <v-card class="mb-4">
            <v-card-title>About This Rocket</v-card-title>
            <v-card-text>
              <p class="text-body-1">
                {{ rocket.description }}
              </p>
              
              <!-- Specifications -->
              <v-divider
                class="my-4"
              />
              <h3 class="text-h6 mb-3">
                Specifications
              </h3>
              <v-row dense>
                <v-col
                  cols="6"
                  md="4"
                >
                  <div class="text-caption text-grey">
                    Company
                  </div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ rocket.company }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <div class="text-caption text-grey">
                    Country
                  </div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ rocket.country }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <div class="text-caption text-grey">
                    Type
                  </div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ rocket.type }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <div class="text-caption text-grey">
                    Stages
                  </div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ rocket.stages }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <div class="text-caption text-grey">
                    Boosters
                  </div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ rocket.boosters }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Gallery -->
          <v-card v-if="rocket.flickr_images.length > 1">
            <v-card-title>Gallery</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="(image, index) in rocket.flickr_images.slice(1)"
                  :key="index"
                  cols="6"
                  md="4"
                >
                  <v-img
                    :src="image"
                    height="200"
                    cover
                    class="rounded-lg"
                    style="cursor: pointer"
                    @click="openImageDialog(image)"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Stats -->
        <v-col
          cols="12"
          md="4"
        >
          <!-- Cost Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon
                color="green"
                class="mr-2"
              >
                mdi-cash
              </v-icon>
              Cost per Launch
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h2 font-weight-bold text-green">
                ${{ (rocket.cost_per_launch / 1000000).toFixed(1) }}M
              </div>
              <div class="text-caption text-grey mt-2">
                per launch
              </div>
            </v-card-text>
          </v-card>

          <!-- Success Rate Card -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon
                color="orange"
                class="mr-2"
              >
                mdi-trending-up
              </v-icon>
              Success Rate
            </v-card-title>
            <v-card-text class="text-center py-6">
              <v-progress-circular
                :model-value="rocket.success_rate_pct"
                size="120"
                width="12"
                color="orange"
                class="mb-4"
              >
                <span class="text-h5">{{ rocket.success_rate_pct }}%</span>
              </v-progress-circular>
              <div class="text-caption text-grey">
                Historical success rate
              </div>
            </v-card-text>
          </v-card>

          <!-- First Flight Card -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon
                color="blue"
                class="mr-2"
              >
                mdi-calendar
              </v-icon>
              First Flight
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h4 font-weight-bold">
                {{ formatDate(rocket.first_flight) }}
              </div>
              <v-chip
                class="mt-4"
                color="blue"
                variant="outlined"
              >
                {{ yearsSinceFirstFlight }} years ago
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Image Dialog -->
    <v-dialog
      v-model="showImageDialog"
      max-width="800"
    >
      <v-card>
        <v-img
          :src="selectedImage"
          max-height="600"
          contain
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary" 
            @click="showImageDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Rocket } from '@/types/rocket';

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const rocket = ref<Rocket | null>(null);
const showImageDialog = ref(false);
const selectedImage = ref('');

const rocketImage = computed(() => {
  return rocket.value?.flickr_images[0] || 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop';
});

const yearsSinceFirstFlight = computed(() => {
  if (!rocket.value) return 0;
  const firstFlight = new Date(rocket.value.first_flight);
  const now = new Date();
  return now.getFullYear() - firstFlight.getFullYear();
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchRocket = async () => {
  const rocketId = route.params.id as string;
  
  // First check if rocket is in store
  const cachedRocket = store.getRocketById(rocketId);
  if (cachedRocket) {
    rocket.value = cachedRocket;
    return;
  }

  // If not in store, fetch from API
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/rockets/${rocketId}`);
    if (!response.ok) throw new Error('Failed to fetch rocket details');
    
    const data = await response.json();
    rocket.value = data;
  } catch (err) {
    error.value = 'Failed to load rocket details. Please try again.';
    console.error('Error fetching rocket:', err);
  } finally {
    isLoading.value = false;
  }
};

const openImageDialog = (image: string) => {
  selectedImage.value = image;
  showImageDialog.value = true;
};

onMounted(() => {
  fetchRocket();
});
</script>