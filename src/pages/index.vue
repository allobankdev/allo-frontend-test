<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import RocketCard from "@/components/rockets/RocketCard.vue";
import { useRocketStore } from "@/stores/rocket";

const rocketStore = useRocketStore();

const { filteredRockets, searchQuery, loading, error } =
  storeToRefs(rocketStore);

onMounted(() => {
  void rocketStore.fetchRockets();
});
</script>

<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-container class="d-flex align-center">
        <v-icon class="mr-2" icon="mdi-rocket-launch" />

        <v-app-bar-title>SpaceX Rockets</v-app-bar-title>

        <v-btn color="primary" prepend-icon="mdi-plus" variant="flat">
          Add Rocket
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <v-text-field
          v-model="searchQuery"
          aria-label="Filter rockets"
          clearable
          hide-details
          label="Search rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />

        <v-alert
          v-if="error"
          class="mt-6"
          title="Unable to load rockets"
          type="error"
          variant="tonal"
        >
          <p class="mb-4">{{ error }}</p>

          <v-btn
            color="error"
            prepend-icon="mdi-refresh"
            variant="outlined"
            @click="rocketStore.retry"
          >
            Retry
          </v-btn>
        </v-alert>

        <v-row v-else-if="loading" class="mt-4">
          <v-col v-for="item in 6" :key="item" cols="12" md="6" lg="4">
            <v-skeleton-loader elevation="2" type="image, heading, paragraph" />
          </v-col>
        </v-row>

        <v-alert
          v-else-if="filteredRockets.length === 0"
          class="mt-6"
          text="Try another search term."
          title="No rockets found"
          type="info"
          variant="tonal"
        />

        <v-row v-else class="mt-4">
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
