<template>
  <v-container class="py-8" max-width="1000">
    <div class="mb-6">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        Back to Rockets
      </v-btn>
    </div>

    <div v-if="detailLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-h6 text-medium-emphasis">Loading rocket specifications...</p>
    </div>

    <ErrorState
      v-else-if="detailError && !selectedRocket"
      :message="detailError"
      @retry="handleRetry"
    />

    <v-card v-else-if="selectedRocket" elevation="3" rounded="lg" class="overflow-hidden">
      <v-img
        :src="imageSrc"
        height="400"
        cover
        class="bg-grey-darken-4"
        @error="handleImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>

        <div class="d-flex justify-space-between p-4 ma-4">
          <v-chip
            v-if="selectedRocket.manufacturer?.country_code"
            color="primary"
            variant="flat"
            size="default"
          >
            {{ selectedRocket.manufacturer.country_code }}
          </v-chip>
          <v-chip
            v-if="selectedRocket.is_custom"
            color="secondary"
            variant="flat"
            size="default"
          >
            User Added Rocket
          </v-chip>
        </div>
      </v-img>

      <v-card-item class="pa-6">
        <h1 class="text-h4 font-weight-bold mb-2">
          {{ selectedRocket.full_name || 'Unnamed Rocket' }}
        </h1>
        <p v-if="selectedRocket.family" class="text-subtitle-1 text-medium-emphasis mb-4">
          Family: {{ selectedRocket.family }} {{ selectedRocket.variant ? `(${selectedRocket.variant})` : '' }}
        </p>
      </v-card-item>

      <v-divider />

      <v-card-text class="pa-6">
        <h2 class="text-h6 font-weight-bold mb-3">Overview</h2>
        <p class="text-body-1 text-medium-emphasis mb-6" style="line-height: 1.7;">
          {{ selectedRocket.description || 'No detailed description available for this launcher configuration.' }}
        </p>

        <h2 class="text-h6 font-weight-bold mb-4">Technical & Launch Specifications</h2>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card variant="tonal" class="pa-4 rounded-lg">
              <div class="text-caption text-medium-emphasis">Cost Per Launch</div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ formatCost(selectedRocket.launch_cost) }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card variant="tonal" class="pa-4 rounded-lg">
              <div class="text-caption text-medium-emphasis">Country of Origin</div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ selectedRocket.manufacturer?.country_code || 'N/A' }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card variant="tonal" class="pa-4 rounded-lg">
              <div class="text-caption text-medium-emphasis">First Flight (Maiden)</div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ formatDate(selectedRocket.maiden_flight) }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Return to List
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-else class="text-center py-12">
      <p class="text-h6 text-medium-emphasis">Rocket not found.</p>
      <v-btn color="primary" class="mt-4" @click="goBack">Return to List</v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRockets } from '@/composables/useRockets';
import ErrorState from '@/components/ErrorState.vue';

const route = useRoute();
const router = useRouter();

const {
  selectedRocket,
  detailLoading,
  detailError,
  loadRocketDetail,
} = useRockets();

const imageFailed = ref(false);
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=1200&q=80';

const imageSrc = computed(() => {
  if (imageFailed.value || !selectedRocket.value?.image_url) {
    return DEFAULT_IMAGE;
  }
  return selectedRocket.value.image_url;
});

function handleImageError() {
  imageFailed.value = true;
}

const rocketId = computed(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});

onMounted(() => {
  if (rocketId.value) {
    loadRocketDetail(rocketId.value);
  }
});

function handleRetry() {
  if (rocketId.value) {
    loadRocketDetail(rocketId.value);
  }
}

function goBack() {
  router.push('/');
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatCost(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') return 'N/A';
  const num = typeof cost === 'number' ? cost : parseFloat(cost);
  if (isNaN(num)) return String(cost);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}
</script>
