<template>
  <div>
    <!-- Loading State -->
    <v-container
      v-if="rocketStore.loading && !rocket"
      class="py-12 text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="text-grey mt-4">
        Loading rocket details...
      </p>
    </v-container>

    <!-- Error State -->
    <div
      v-else-if="rocketStore.error"
      class="py-6"
    >
      <v-empty-state
        headline="Oops!"
        title="Failed to Load Data"
        :text="rocketStore.error"
        image="https://cdn.vuetifyjs.com/docs/images/logos/v.png"
      >
        <template #actions>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-refresh"
            @click="() => rocketStore.fetchAllRockets()"
          >
            Retry
          </v-btn>
        </template>
      </v-empty-state>
    </div>

    <!-- Not Found -->
    <v-container
      v-else-if="!rocket"
      class="py-12"
    >
      <v-empty-state
        headline="Whoops, 404"
        title="Rocket not found"
        text="The rocket you were looking for does not exist or has been removed."
        image="https://cdn.vuetifyjs.com/docs/images/logos/v.png"
      >
        <template #actions>
          <v-btn
            color="primary"
            variant="flat"
            to="/rockets"
            prepend-icon="mdi-arrow-left"
          >
            Back to Rockets
          </v-btn>
        </template>
      </v-empty-state>
    </v-container>

    <v-container
      v-else
      class="py-6"
    >
      <!-- Action Back -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-btn
            variant="text"
            prepend-icon="mdi-arrow-left"
            to="/rockets"
          >
            Back to Rockets
          </v-btn>
        </v-col>
      </v-row>

      <!-- Presentation Component -->
      <RocketDetail :rocket="rocket" />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRocketStore } from '@/features/rockets/store/rocket.store';
import RocketDetail from '@/features/rockets/components/RocketDetail.vue';

const route = useRoute();
const rocketStore = useRocketStore();

const rocketId = route.params.id as string;

// Get Rocket by ID
const rocket = computed(() => {
  return rocketStore.combinedRockets.find((r) => String(r.id) === rocketId);
});

// Fetch all data once on mount
onMounted(() => {
  rocketStore.fetchAllRockets();
});
</script>
