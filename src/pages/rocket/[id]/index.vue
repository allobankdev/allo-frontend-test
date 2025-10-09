<script setup lang="ts">
import { useRocketStore } from "@/stores/rocketStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const rocketStore = useRocketStore();
const { fetchRocketById } = rocketStore;
const { loading, detailRocket } = storeToRefs(rocketStore);

const route = useRoute();

onMounted(() => {
  fetchRocketById(route.params.id as string);
});
</script>

<template>
  <v-container class="py-10">
    <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.back()">
      Back
    </v-btn>

    <v-skeleton-loader v-if="loading" type="image, article" class="mt-6" />

    <div v-else-if="detailRocket" class="mt-6">
      <v-img
        :src="detailRocket.flickr_images?.[0]"
        height="400px"
        class="rounded-xl mb-6"
        cover
      />

      <h1 class="text-h4 mb-2">
        {{ detailRocket.name }}
      </h1>
      <p class="text-subtitle-1 text-grey mb-4">
        {{ detailRocket.country }}
      </p>
      <v-divider class="mb-4" />
      <p class="mb-6">
        {{ detailRocket.description }}
      </p>

      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="pa-4">
            <strong>Cost per Launch:</strong>
            <div>${{ detailRocket.cost_per_launch.toLocaleString() }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-4">
            <strong>First Flight:</strong>
            <div>{{ detailRocket.first_flight }}</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-alert type="error" class="mt-6">Rocket not found</v-alert>
    </div>
  </v-container>
</template>
