<template>
  <v-card
    class="mx-auto my-4 rocket-card"
    elevation="4"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <v-img
      cover
      height="200"
      :src="
        rocket.flickr_images[0] ||
        'https://via.placeholder.com/300x200?text=No+Image'
      "
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle>
        <span class="me-1">{{ rocket.country }}</span>
        <v-icon color="error" icon="mdi-fire" size="small"></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <div class="text-truncate-2">
        {{ rocket.description }}
      </div>
    </v-card-text>

    <v-card-actions>
      <div class="px-2 w-100 d-flex justify-space-between align-center">
        <v-chip size="small" color="primary" variant="tonal">
          {{ formatCurrency(rocket.cost_per_launch) }}
        </v-chip>
        <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
          Details
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Rocket } from "@/stores/rocket";

const props = defineProps<{
  rocket: Rocket;
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(value);
};
</script>

<style scoped lang="scss">
.rocket-card {
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
