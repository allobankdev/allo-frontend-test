<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="handleBack">
          Back to Rockets
        </v-btn>
      </v-col>
    </v-row>

    <LoadingState v-if="isLoading" message="Loading..." />

    <ErrorState v-else-if="isError" :message="errorMessage" />

    <div v-else-if="rocket">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <h1 class="text-h3">{{ rocket.name }}</h1>
            <v-chip :color="rocket.isActive ? 'success' : 'error'" size="large">
              {{ rocket.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="rocket.flickrImages.length > 0">
        <v-col cols="12">
          <v-carousel height="400" hide-delimiters>
            <v-carousel-item
              v-for="(image, index) in rocket.flickrImages"
              :key="index"
              :src="image"
              cover
            ></v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <p class="text-body-1">{{ rocket.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>General Information</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title>First Flight</v-list-item-title>
                  <v-list-item-subtitle>{{ rocket.firstFlight }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-earth</v-icon>
                  </template>
                  <v-list-item-title>Country</v-list-item-title>
                  <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-cash</v-icon>
                  </template>
                  <v-list-item-title>Cost Per Launch</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ CurrencyUtil.formatCurrencyMillion(rocket.costPerLaunch) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-row v-else>
      <EmptyState />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import { RocketRepositorySpaceX } from '@/data/rocket/rocket.repository.spacex';
import { CurrencyUtil } from '@/utils/currency.util';
import EmptyState from './components/EmptyState.vue';

const router = useRouter();
const route = useRoute();
const store = useStore();

const repository = new RocketRepositorySpaceX();

const rocket = computed(() => store.getters['rocketDetail/selectedRocket']);
const isLoading = computed(() => store.getters['rocketDetail/isLoading']);
const isError = computed(() => store.getters['rocketDetail/isError']);
const errorMessage = computed(() => store.getters['rocketDetail/errorMessage']);

const handleLoadRocketDetail = async (rocketId: string) => {
  store.dispatch('rocketDetail/markAsLoading');

  try {
    const data = await repository.fetchOne(rocketId);
    store.dispatch('rocketDetail/loadRocket', data);
    store.dispatch('rocketDetail/markAsSuccess');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load rocket detail';
    store.dispatch('rocketDetail/markAsError', message);
  }
};

const handleBack = () => {
  router.push('/');
};

onMounted(() => {
  const rocketId = route.params.id as string;

  if (rocketId) {
    handleLoadRocketDetail(rocketId);
  }
});
</script>

<style scoped></style>
