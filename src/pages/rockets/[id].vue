<template>
  <v-container>
    <v-btn
      variant="text"
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="router.back()"
    >
      Back to List
    </v-btn>

    <div
      v-if="loading"
      class="d-flex justify-center my-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <div
      v-else-if="error"
      class="my-8 text-center"
    >
      <v-alert
        type="error"
        class="mb-4"
        :text="error"
      />
      <v-btn
        color="primary"
        @click="fetchDetail"
      >
        Retry
      </v-btn>
    </div>

    <v-card v-else-if="rocket">
      <v-img
        :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/800x400?text=No+Image'"
        height="400"
        cover
        class="align-end"
      >
        <v-card-title class="text-h4 text-white bg-black-opacity font-weight-bold">
          {{ rocket.name }}
        </v-card-title>
      </v-img>

      <v-card-text class="pt-4">
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <h2 class="text-h6 mb-2">
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
            <v-list lines="one">
              <v-list-item>
                <template #prepend>
                  <v-icon
                    icon="mdi-cash"
                    color="green"
                  />
                </template>
                <v-list-item-title>Cost per Launch</v-list-item-title>
                <v-list-item-subtitle>{{ formatCurrency(rocket.cost_per_launch) }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template #prepend>
                  <v-icon
                    icon="mdi-flag"
                    color="blue"
                  />
                </template>
                <v-list-item-title>Country</v-list-item-title>
                <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon
                    icon="mdi-calendar"
                    color="orange"
                  />
                </template>
                <v-list-item-title>First Flight</v-list-item-title>
                <v-list-item-subtitle>{{ rocket.first_flight }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Rocket } from '@/stores/rocketStore';

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchDetail = async () => {
    const id = route.params.id as string;
    loading.value = true;
    error.value = null;
    
    // Check locally first (for added items support)
    const localRocket = store.rockets.find(r => r.id === id);
    if (localRocket) {
        rocket.value = localRocket;
        loading.value = false;
        return;
    }

    try {
        rocket.value = await store.fetchRocketById(id);
    } catch (e) {
        console.error(e);
        error.value = 'Failed to load rocket details.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchDetail();
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>

<style scoped>
.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 16px; 
}
</style>
