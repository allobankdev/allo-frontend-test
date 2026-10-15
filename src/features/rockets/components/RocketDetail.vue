<template>
  <!-- Rocket Detail Content -->
  <v-row>
    <!-- Image -->
    <v-col
      cols="12"
      md="5"
    >
      <v-card
        elevation="2"
        class="rounded-lg overflow-hidden"
      >
        <v-img
          :src="rocket.imageUrl || 'https://placehold.co/600x400/1e293b/ffffff?text=No+Rocket+Image'"
          height="350"
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
              height="350"
              cover
              class="bg-grey-lighten-2"
              src="https://placehold.co/600x400/1e293b/ffffff?text=No+Rocket+Image"
            />
          </template>
        </v-img>
      </v-card>
    </v-col>

    <!-- Information -->
    <v-col
      cols="12"
      md="7"
    >
      <div class="ps-md-4">
        <h1 class="text-h3 font-weight-bold mb-2">
          {{ rocket.name }}
        </h1>

        <div class="d-flex align-center ga-3 mb-4">
          <v-chip
            color="primary"
            variant="flat"
            size="small"
          >
            {{ rocket.countryCode }}
          </v-chip>
          <span class="text-subtitle-1 text-grey">
            First Flight: {{ formatDate(rocket.maidenFlight) }}
          </span>
        </div>

        <p
          class="text-body-1 text-grey-darken-2 mb-6"
          style="line-height: 1.8;"
        >
          {{ rocket.description }}
        </p>

        <v-divider class="mb-6" />

        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <span class="text-caption text-grey d-block mb-1">Cost per Launch</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(rocket.launchCost) }}
              </span>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <span class="text-caption text-grey d-block mb-1">Rocket ID</span>
              <span class="text-subtitle-1 font-weight-medium text-truncate d-block">
                {{ rocket.id }}
              </span>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Rocket } from '../rocket.types';

defineProps<{
  rocket: Rocket;
}>();
</script>
