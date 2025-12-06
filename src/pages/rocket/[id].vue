<template>
  <div>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isLoading"
      type="image, heading, paragraph"
      class="mx-auto"
      max-width="800"
    />

    <!-- Content -->
    <div v-else class="mx-auto" style="max-width: 800px">
      <!-- Title -->
      <h1 class="mb-4">{{ rocket?.name }}</h1>

      <!-- Description -->
      <p class="text-body-1 mb-6">{{ rocket?.description }}</p>

      <!-- Images -->
      <v-carousel height="350" hide-delimiters>
        <v-carousel-item
          v-for="(img, i) in rocket?.flickr_images"
          :key="i"
          :src="img"
          cover
        />
      </v-carousel>

      <!-- Summary Info -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Rocket Information</h2>

        <v-row>
          <v-col cols="6">
            <strong>Cost per Launch:</strong> ${{
              rocket?.cost_per_launch.toLocaleString()
            }}
          </v-col>
          <v-col cols="6">
            <strong>Country:</strong> {{ rocket?.country }}
          </v-col>
          <v-col cols="6">
            <strong>First Flight:</strong> {{ rocket?.first_flight }}
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOneRocket } from "@/services/rocket";
import { useRocketStore } from "@/stores/rockets";
import type { Rocket } from "@/types/rockets";
import { useQuery } from "@tanstack/vue-query";
import { onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const rocket = ref<Rocket | undefined>();
const rocketId = route.params.id;
const rocketStore = useRocketStore();

const { data, isLoading, isError } = useQuery({
  queryKey: ["rocket", rocketId],
  queryFn: () => getOneRocket(rocketId),
});

const fetchRocketData = () => {
  const cachedRocket = rocketStore.getRocketById(rocketId);

  if (isError.value) {
    rocket.value = cachedRocket;
  } else {
    rocket.value = data.value;
  }
};

watch([data, isError, isLoading], fetchRocketData, { immediate: true });
</script>
