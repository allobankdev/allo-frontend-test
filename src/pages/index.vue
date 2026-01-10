<template>
  <div class="pb-8">
    <FilterRocket v-if="!error" class="mb-4" />

    <v-divider class="mb-4" />

    <AddRocket class="mb-4" />

    <v-divider class="mb-4" />

    <div class="d-flex flex-column ga-4 mt-8">
      <!-- Loading -->
      <template v-if="loading && !error">
        <v-skeleton-loader
          v-for="value in 5"
          :key="`loading-${value}`"
          type="image"
          height="300"
        />
      </template>

      <!-- Error -->
      <template v-else-if="!loading && error">
        <v-empty-state
          action-text="Retry Request"
          image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
          :text="errorMessage"
          title="Something Went Wrong"
          @click:action="onRetryRequest"
        />
      </template>

      <!-- Data -->
      <template v-else-if="!loading && rockets">
        <!-- Results -->
        <template v-if="rockets.length > 0">
          <RocketCard
            v-for="rocket in rockets"
            :key="rocket.id"
            :rocket="rocket"
          />
        </template>

        <!-- No Results -->
        <template v-else>
          <v-empty-state
            icon="mdi-magnify"
            text="Try adjusting your search terms. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRocketStore } from "@/stores/rocketStore";

import RocketCard from "@/components/rockets/RocketCard.vue";
import FilterRocket from "@/components/rockets/FilterRocket.vue";
import AddRocket from "@/components/rockets/AddRocket.vue";

const rocketStore = useRocketStore();
const { rockets, loading, error, errorMessage } = storeToRefs(rocketStore);

onMounted(async () => {
  if (rockets.value.length === 0) await rocketStore.queryRockets();
});

const onRetryRequest = async () => {
  await rocketStore.queryRockets();
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 900px;
}
</style>
