
<template>
  <v-container class="py-8">
    <!-- Back Button -->
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-6"
      @click="goBack"
    >
      Back to Rockets
    </v-btn>

    <!-- Loading -->
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
        Loading rocket details...
      </p>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ errorMessage }}</span>

        <v-btn
          color="error"
          variant="flat"
          @click="loadRocket"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Rocket Detail -->
    <v-card
      v-else-if="rocket"
      rounded="lg"
      variant="outlined"
    >
      <v-row no-gutters>
        <!-- Rocket Image -->
        <v-col cols="12" md="6">
          <v-img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            height="100%"
            min-height="300"
            cover
          >
            <template #error>
              <div class="image-placeholder">
                <v-icon
                  icon="mdi-rocket-launch"
                  size="80"
                  color="grey"
                />
              </div>
            </template>
          </v-img>

          <div
            v-else
            class="image-placeholder"
          >
            <v-icon
              icon="mdi-rocket-launch"
              size="80"
              color="grey"
            />
          </div>
        </v-col>

        <!-- Rocket Information -->
        <v-col cols="12" md="6">
          <v-card-item>
            <v-card-title class="text-h4 text-wrap">
              {{ rocket.full_name || 'Unknown Rocket' }}
            </v-card-title>

            <v-card-subtitle class="mt-2">
              SpaceX Rocket
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <h3 class="text-h6 mb-2">
              Description
            </h3>

            <p class="text-body-1 mb-6">
              {{ rocket.description || 'No description available.' }}
            </p>

            <v-divider class="mb-4" />

            <h3 class="text-h6 mb-3">
              Rocket Information
            </h3>

            <v-list density="comfortable">
              <v-list-item
                prepend-icon="mdi-currency-usd"
                title="Cost per Launch"
                :subtitle="formatLaunchCost(rocket.launch_cost)"
              />

              <v-list-item
                prepend-icon="mdi-earth"
                title="Country"
                :subtitle="rocket.manufacturer?.country_code || 'Not available'"
              />

              <v-list-item
                prepend-icon="mdi-calendar"
                title="First Flight"
                :subtitle="rocket.maiden_flight || 'Not available'"
              />
            </v-list>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getRocketById } from '@/services/rocketService';
import type { Rocket } from '@/types/rocket';

const route = useRoute();
const router = useRouter();

// State
const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const errorMessage = ref('');

// Get rocket detail from API
async function loadRocket() {
  const id = String(route.params.id ?? '');

  if (!id) {
    errorMessage.value = 'Rocket ID is invalid.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  rocket.value = null;

  try {
    rocket.value = await getRocketById(id);
  } catch (error) {
    console.error('Failed to load rocket detail:', error);

    errorMessage.value =
      'Failed to load rocket details. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Format launch cost
function formatLaunchCost(cost: string | number | null) {
  if (cost === null || cost === undefined || cost === '') {
    return 'Not available';
  }

  return typeof cost === 'number'
    ? `$${cost.toLocaleString('en-US')}`
    : cost;
}

// Back to rocket list
function goBack() {
  router.push('/');
}

// Load data when route ID changes
watch(
  () => route.params.id,
  () => loadRocket(),
  { immediate: true }
);
</script>

<style scoped>
.image-placeholder {
  min-height: 300px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
}
</style>
