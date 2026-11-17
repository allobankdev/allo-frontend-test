
<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center flex-wrap ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>

        <p class="text-body-1 text-medium-emphasis mt-2">
          Explore the rockets developed by SpaceX.
        </p>
      </div>

      <RocketForm @add="addRocket" />
    </div>

    <!-- Search / Filter -->
    <v-text-field
      v-model="search"
      label="Search rocket"
      placeholder="Enter rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
    />

    <!-- Loading State -->
    <div
      v-if="loading"
      class="d-flex flex-column align-center justify-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />

      <p class="mt-4 text-medium-emphasis">
        Loading rockets...
      </p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ errorMessage }}</span>

        <v-btn
          color="error"
          variant="flat"
          @click="loadRockets"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Success State -->
    <template v-else>
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-body-2 text-medium-emphasis">
          {{ filteredRockets.length }} rockets found
        </span>
      </div>

      <v-row v-if="filteredRockets.length > 0">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="rocket-card h-100"
            rounded="lg"
            variant="outlined"
          >
            <!-- Rocket Image -->
            <v-img
              :src="rocket.image_url || undefined"
              height="190"
              cover
              :alt="rocket.full_name"
            >
              <template #error>
                <div
                  class="d-flex align-center justify-center h-100 bg-grey-lighten-3"
                >
                  <v-icon
                    icon="mdi-rocket-launch"
                    size="64"
                    color="grey"
                  />
                </div>
              </template>
            </v-img>

            <!-- Rocket Information -->
            <v-card-title class="text-wrap">
              {{ rocket.full_name || 'Unknown Rocket' }}
            </v-card-title>

            <v-card-text>
              <p class="text-body-2 text-medium-emphasis rocket-description">
                {{ rocket.description || 'No description available.' }}
              </p>
            </v-card-text>

            <!-- Detail Button -->
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                color="primary"
                variant="flat"
                block
                @click="goToDetail(rocket.id)"
              >
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty Search Result -->
      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        No rockets found.
      </v-alert>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted,onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getRockets } from '@/services/rocketService';
import type { Rocket } from '@/types/rocket';

const router = useRouter();

// State
const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const search = ref('');

// Filter rockets based on search input
const filteredRockets = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) {
    return rockets.value;
  }

  return rockets.value.filter((rocket) => {
    return (
      rocket.full_name?.toLowerCase().includes(keyword) ||
      rocket.description?.toLowerCase().includes(keyword)
    );
  });
});

// Fetch rockets from API
async function loadRockets() {
  loading.value = true;
  errorMessage.value = '';

  try {
    rockets.value = await getRockets();
  } catch (error) {
    console.error('Failed to load rockets:', error);

    errorMessage.value =
      'Failed to load rockets. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Navigate to rocket detail page
function goToDetail(id: number) {
  router.push(`/rockets/${id}`);
}

//add rocket data
type NewRocketPayload = Omit<Rocket, 'id' | 'image_url'> & {
  imageFile: File | null;
};

const localImageUrls = new Set<string>();

function addRocket(newRocket: NewRocketPayload) {
  const { imageFile, ...rocketData } = newRocket;

  const imageUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : null;

  if (imageUrl) {
    localImageUrls.add(imageUrl);
  }

  const newId = rockets.value.length
    ? Math.max(...rockets.value.map((rocket) => rocket.id)) + 1
    : 1;

  rockets.value.unshift({
    id: newId,
    image_url: imageUrl,
    ...rocketData,
  });
}

// Release local image URLs when leaving the page
onBeforeUnmount(() => {
  localImageUrls.forEach((url) => {
    URL.revokeObjectURL(url);
  });

  localImageUrls.clear();
});

// Lifecycle
onMounted(() => {
  loadRockets();
});
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 60px;
}
</style>
