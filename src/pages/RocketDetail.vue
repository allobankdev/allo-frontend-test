<template>
  <v-container>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="$router.push('/')"
    >
      Back to List
    </v-btn>

    <div v-if="!rocket" class="text-center mt-12">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-card v-else class="mx-auto" elevation="2">
      <v-img
        :src="rocket.flickr_images[0]"
        height="400px"
        cover
        class="align-end"
      >
        <v-card-title
          class="text-h3 text-white font-weight-bold"
          style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6)"
        >
          {{ rocket.name }}
        </v-card-title>
      </v-img>

      <v-card-text class="pt-6">
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-list-item
              prepend-icon="mdi-calendar"
              title="First Flight"
              :subtitle="rocket.first_flight"
            ></v-list-item>
          </v-col>
          <v-col cols="12" md="4">
            <v-list-item
              prepend-icon="mdi-cash"
              title="Cost per Launch"
              :subtitle="`$${rocket.cost_per_launch.toLocaleString()}`"
            ></v-list-item>
          </v-col>
          <v-col cols="12" md="4">
            <v-list-item
              prepend-icon="mdi-map-marker"
              title="Country"
              :subtitle="rocket.country"
            ></v-list-item>
          </v-col>
        </v-row>

        <div class="text-body-1">
          {{ rocket.description }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocketStore";

const route = useRoute();
const store = useRocketStore();

onMounted(() => {
  if (store.rockets.length === 0) store.loadData();
});

const rocket = computed(() => store.getRocketById(route.params.id as string));
</script>
