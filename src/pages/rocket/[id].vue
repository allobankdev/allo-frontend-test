<template>
  <div class="h-screen">
    <v-btn class="btn" to="/" prepend-icon="mdi-chevron-left"> Back </v-btn>

    <!-- Loading -->
    <template v-if="loading && !rocketData">
      <v-skeleton-loader type="image" height="400" />

      <v-skeleton-loader type="subtitle, text" lines="two" class="mt-8" />
    </template>

    <!-- Error -->
    <template v-else-if="!loading && !rocketData && error">
      <v-empty-state
        action-text="Retry Request"
        image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
        :text="errorMessage"
        title="Something Went Wrong"
        @click:action="onRetryRequest"
      />
    </template>

    <!-- Data -->
    <template v-else-if="!loading && rocketData">
      <v-carousel height="400" show-arrows="hover">
        <v-carousel-item
          v-for="image in rocketData?.flickr_images"
          :key="image"
          :src="image"
          cover
        />
      </v-carousel>

      <div class="d-flex align-center justify-space-between mt-8">
        <div>
          <h2 class="text-h4 font-weight-bold">
            {{ rocketData?.name }}
          </h2>
          <span class="text-grey-darken-1">
            First Flight: {{ rocketData?.first_flight }}
          </span>
        </div>
        <span class="text-grey-darken-1">{{ rocketData?.country }}</span>
      </div>
      <p class="mt-6 text-grey-lighten-1">
        {{ rocketData?.description }}
      </p>
      <p class="mt-8 text-grey-lighten-1">
        Cost per launch: {{ rocketData?.cost_per_launch }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { useRocketStore } from "@/stores/rocketStore";
import type { Rocket } from "@/types/rocket";

const rocketStore = useRocketStore();
const { loading, errorMessage, error } = storeToRefs(rocketStore);

const route = useRoute();
const id = route.params.id as string;

const rocketData = ref<Rocket | null>(null);

onMounted(async () => {
  window.scrollTo(0, 0);

  // Get data from temp state
  const localRocket = rocketStore.getRocketMockup(id);
  if (localRocket) {
    rocketData.value = localRocket;
    return;
  }

  // Get data from API
  rocketData.value = await rocketStore.getRocket(id);
});

const onRetryRequest = async () => {
  await rocketStore.getRocket(id);
};
</script>

<style scoped>
.btn {
  position: absolute;
  left: 20px;
  top: 16px;
  z-index: 50;
}
</style>
