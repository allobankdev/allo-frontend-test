<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Rocket } from '@/types/rocket';
import { getRocketById } from '@/services/rocketService';
import { useRockets } from '@/composables/useRockets';

const route = useRoute();
const router = useRouter();
const { rockets } = useRockets();

const rocket = ref<Rocket | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const formatValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  return value
}


async function loadDetail() {
  loading.value = true;
  error.value = null;

  try {
    const id = String(route.params.id);

    // Periksa apakah roket berasal dari penambahan lokal
    const localRocket = rockets.value.find(
      (item) => String(item.id) === id
    );

    if (localRocket) {
      rocket.value = localRocket;
      return;
    }

    // Jika bukan data lokal, ambil dari API
    rocket.value = await getRocketById(id);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load rocket';
  } finally {
    loading.value = false;
  }
}


onMounted(loadDetail);
</script>

<template>
  <v-container class="py-8">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-6"
      @click="router.push('/')"
    >
      Back to Rockets
    </v-btn>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate size="48" />
      <p class="mt-4">Loading rocket details...</p>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}

      <template #append>
        <v-btn color="error" @click="loadDetail">
          Retry
        </v-btn>
      </template>
    </v-alert>

    <v-card v-else-if="rocket" rounded="lg">
      <v-img
        :src="rocket.image_url || undefined"
        height="350"
        cover
        class="bg-grey-lighten-3"
      >
        <template #error>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon size="80" color="grey">mdi-rocket</v-icon>
          </div>
        </template>
      </v-img>

      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ rocket.full_name }}
        </h1>

        <p class="text-body-1 mb-8">
          {{ rocket.description || 'Description not available.' }}
        </p>

        <v-divider class="mb-6" />

        <v-row>
        <v-col cols="12" sm="4">
            <div class="text-subtitle-2 text-medium-emphasis">
            Cost per Launch
            </div>
            <div class="text-h6 mt-2">
            {{ rocket.launch_cost != null
                ? '$' + rocket.launch_cost.toLocaleString('en-US')
                : formatValue(rocket.launch_cost) }}
            </div>
        </v-col>

        <v-col cols="12" sm="4">
            <div class="text-subtitle-2 text-medium-emphasis">
            Country
            </div>
            <div class="text-h6 mt-2">
            {{ formatValue(rocket.manufacturer?.country_code) }}
            </div>
        </v-col>

        <v-col cols="12" sm="4">
            <div class="text-subtitle-2 text-medium-emphasis">
            First Flight
            </div>
            <div class="text-h6 mt-2">
            {{ formatValue(rocket.maiden_flight) }}
            </div>
        </v-col>
        </v-row>

        </v-card-text>
    </v-card>
  </v-container>
</template>
