<template>
  <v-card
    class="h-d-flex flex-column"
    elevation="2"
  >
    <v-img
      :src="rocket.imageUrl || 'https://placehold.co/600x400/1e293b/ffffff?text=No+Rocket+Image'"
      height="200"
      cover
      class="bg-grey-lighten-2"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>
      </template>

      <template #error>
        <v-img
          height="200"
          cover
          class="bg-grey-lighten-2"
          src="https://placehold.co/600x400/1e293b/ffffff?text=No+Rocket+Image"
        />
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="font-weight-bold">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ rocket.countryCode }} • First Flight:
        {{ formatDate(rocket.maidenFlight) }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-truncate">
      {{ rocket.description }}
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-space-between px-4 py-3">
      <span class="text-caption text-grey">
        Cost per Launch: {{ formatCurrency(rocket.launchCost) }}
      </span>
      <v-btn
        color="primary"
        variant="text"
        density="comfortable"
        :to="`/rockets/${rocket.id}`"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Rocket } from "../rocket.types";

defineProps<{
  rocket: Rocket;
}>();
</script>
