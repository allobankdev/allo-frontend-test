<script setup lang="ts">
import { useRocket } from "@/stores/rocket";
import { onMounted, toRaw } from "vue";
import { VCol } from "vuetify/components";

const rocketStore = useRocket();

onMounted(() => {
  rocketStore.fetchRockets();
});
</script>

<template>
  <v-row align="stretch">
    <v-col
      v-if="rocketStore.isLoadingRockets"
      v-for="i in 6"
      cols="12"
      sm="6"
      md="4"
    >
      <v-skeleton-loader
        class="skeleton-rocket-card"
        type="image, article"
        height="100%"
      ></v-skeleton-loader>
    </v-col>
    <v-col v-else-if="rocketStore.isFetchRocketFailed" cols="12">
      <v-card class="error-state mx-auto pa-8 text-center" variant="text">
        <v-icon size="56" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <v-card-title class="text-h5 px-0">Failed to fetch data</v-card-title>
        <v-card-text class="px-0">
          Something went wrong while loading the rockets. Please try again.
        </v-card-text>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          :loading="rocketStore.isLoadingRockets"
          @click="rocketStore.fetchRockets()"
        >
          Try again
        </v-btn>
      </v-card>
    </v-col>
    <v-col
      v-else-if="!rocketStore.rockets.length && rocketStore.committedSearch"
      cols="12"
    >
      <v-card class="error-state mx-auto pa-8 text-center" variant="text">
        <v-card-text class="px-0">
          No search results found for "{{ toRaw(rocketStore.filter).search }}"
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-else-if="!rocketStore.rockets.length" cols="12">
      <v-card class="error-state mx-auto pa-8 text-center" variant="text">
        <v-card-text class="px-0">
          No rockets found. Please add a new rocket.
        </v-card-text>
      </v-card>
    </v-col>
    <template v-else>
      <v-col
        v-for="rocket in rocketStore.rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card :to="`/${rocket.id}`" height="100%">
          <v-img
            v-if="rocket.image_url"
            :aspect-ratio="4 / 5"
            class="bg-surface elevation-3 fill-width"
            :src="rocket.image_url"
            cover
          ></v-img>
          <div v-else class="rocket-image-fallback bg-surface elevation-3">
            <v-icon size="56" color="medium-emphasis">mdi-rocket</v-icon>
            <span>No image available</span>
          </div>
          <v-card-item>
            <v-card-title>{{ rocket.full_name }}</v-card-title>
          </v-card-item>
          <v-card-text>{{ rocket.description }}</v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<style scoped>
.skeleton-rocket-card :deep(.v-skeleton-loader__image) {
  aspect-ratio: 4/5;
  min-height: 250px !important;
}

.rocket-image-fallback {
  aspect-ratio: 4 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
}
</style>
