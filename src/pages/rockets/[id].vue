<template>
  <!-- Loading -->
  <LoadingSpinner v-if="isLoading" />

  <!-- Error -->
  <ErrorState v-else-if="error" :message="error" @retry="() => store.fetchRockets()" />

  <!-- Success -->
  <v-row v-else-if="rocket" justify="center">
    <v-col cols="12" md="8">
      <v-card elevation="3">
        <!-- Image -->
        <v-img :src="rocket.flickr_images[0] || placeholder" height="300" cover>
          <v-chip
            class="ma-3"
            :color="rocket.active ? 'success' : 'error'"
            size="small"
            variant="elevated">
            {{ rocket.active ? 'Active' : 'Inactive' }}
          </v-chip>
        </v-img>

        <!-- Title -->
        <v-card-title class="text-h4 font-weight-bold pb-0">
          {{ rocket.name }}
        </v-card-title>

        <v-card-subtitle class="text-grey-darken-1 px-4">
          {{ rocket.country }} • {{ rocket.company }}
        </v-card-subtitle>

        <!-- Description -->
        <v-card-text class="pt-4">
          <p class="text-body-1 mb-4">
            {{ rocket.description }}
          </p>

          <!-- Info List -->
          <v-list density="comfortable">
            <v-list-item class="pa-0">
              <v-list-item-title>Cost per Launch</v-list-item-title>
              <v-list-item-subtitle>
                {{ formattedCost }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="pa-0">
              <v-list-item-title>Country</v-list-item-title>
              <v-list-item-subtitle>
                {{ rocket.country }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="pa-0">
              <v-list-item-title>First Flight</v-list-item-title>
              <v-list-item-subtitle>
                {{ formattedDate }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-4 pb-4">
          <v-btn variant="text" color="primary" @click="goBack">
            <v-icon start>mdi-arrow-left</v-icon>
            Back to List
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <!-- Not Found -->
  <v-col v-else justify="center" class="text-center py-10">
    <v-icon size="64" color="grey">mdi-rocket-outline</v-icon>
    <h2 class="mt-4">Rocket not found</h2>
    <v-btn class="mt-4" color="primary" @click="goBack"> Back to List </v-btn>
  </v-col>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores';

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const rocketId = route.params.id as string;

const rocket = computed(() => store.rockets.find(r => r.id === rocketId));

const isLoading = ref(false);
const error = ref<string | null>(null);

const placeholder = 'https://via.placeholder.com/800x400?text=No+Image';

const formattedCost = computed(() => {
  if (!rocket.value) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(rocket.value.cost_per_launch);
});

const formattedDate = computed(() => {
  if (!rocket.value) return '-';
  return new Date(rocket.value.first_flight).toLocaleDateString();
});

onMounted(async () => {
  if (!rocket.value) {
    try {
      isLoading.value = true;
      await store.fetchRockets();
    } catch {
      error.value = 'Failed to load rocket detail';
    } finally {
      isLoading.value = false;
    }
  }
});

const goBack = () => {
  router.push('/rockets');
};
</script>
