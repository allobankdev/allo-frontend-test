<template>
  <v-container>
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      @click="router.back()"
    >
      Back to List
    </v-btn>

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-center align-center py-10"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="d-flex flex-column align-center justify-center py-10"
    >
      <v-icon
        icon="mdi-alert-circle"
        color="error"
        size="64"
        class="mb-4"
      />
      <div class="text-h6 text-error mb-2">
        Rocket Not Found
      </div>
      <v-btn
        color="primary"
        @click="retry"
      >
        Retry
      </v-btn>
    </div>

    <!-- Content -->
    <v-card v-else-if="rocket">
      <v-img
        :src="rocket.flickr_images[0] || 'https://via.placeholder.com/800x400'"
        height="400"
        cover
        class="align-end"
      >
        <v-card-title class="text-white bg-black-opacity text-h3 font-weight-bold pb-4">
          {{ rocket.name }}
        </v-card-title>
      </v-img>

      <v-card-text class="pt-6">
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <h2 class="text-h5 font-weight-bold mb-2">
              Description
            </h2>
            <p class="text-body-1">
              {{ rocket.description }}
            </p>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-card
              variant="tonal"
              color="primary"
            >
              <v-card-text>
                <div class="mb-3">
                  <div class="text-caption text-uppercase font-weight-bold">
                    First Flight
                  </div>
                  <div class="text-h6">
                    {{ formatDate(rocket.first_flight) }}
                  </div>
                </div>
                 
                <div class="mb-3">
                  <div class="text-caption text-uppercase font-weight-bold">
                    Country
                  </div>
                  <div class="text-h6">
                    {{ rocket.country }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-uppercase font-weight-bold">
                    Cost per Launch
                  </div>
                  <div class="text-h6">
                    {{ formatCurrency(rocket.cost_per_launch) }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-uppercase font-weight-bold">
                    Height
                  </div>
                  <div class="text-h6">
                    {{ rocket.height.meters }} m / {{ rocket.height.feet }} ft
                  </div>
                </div>
                 
                <div>
                  <div class="text-caption text-uppercase font-weight-bold">
                    Mass
                  </div>
                  <div class="text-h6">
                    {{ rocket.mass.kg }} kg / {{ rocket.mass.lb }} lb
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/composables/useRocketStore';
import type { Rocket } from '@/types/rocket';
import { spacexService } from '@/services/spacexService';

const route = useRoute();
const router = useRouter();
const store = useRocketStore();
const id = computed(() => route.params.id as string);

const rocket = ref<Rocket | undefined>(undefined);
const loading = ref(false);
const error = ref<string | null>(null);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const loadRocket = async () => {
    loading.value = true;
    error.value = null;
    try {
        // Try store first
        const fromStore = store.getRocketById(id.value);
        if (fromStore) {
            rocket.value = fromStore;
        } else {
            // Not in store? Fetch individual if real ID, or try fetching all if we trust Store to be the cache.
            // If it's a "local" ID (like timestamp), fetch will fail.
            // But if we refreshed, store is empty.
            // Strategy: Ensure store is populated? Or just fetch individual?
            // "Use State Management" implies we should rely on store.
            // But for robustness, let's fetch individual if not found.
            
            // Check if it looks like a local ID? No pattern given.
            // Let's try fetching individual.
            const data = await spacexService.getRocket(id.value);
            rocket.value = data;
        }
    } catch {
        error.value = "Failed to load rocket";
    } finally {
        loading.value = false;
    }
};

const retry = () => {
    loadRocket();
};

onMounted(() => {
    loadRocket();
});

watch(id, () => {
    loadRocket();
});

</script>

<style scoped>
.bg-black-opacity {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
</style>
