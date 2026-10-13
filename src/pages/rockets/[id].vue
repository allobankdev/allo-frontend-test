<script setup lang="ts">
import { useRocketDetailPage } from "@/composables/pages/useRocketDetailPage";
import RocketImage from "@/components/RocketImage.vue";

const { state, rocket, retry, formatText, formatCost, formatDate } =
  useRocketDetailPage();
</script>

<template>
  <div
    v-if="state.status === 'loading'"
    class="text-center py-16"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="40"
    />
    <p class="text-medium-emphasis mt-4">
      Loading rocket…
    </p>
  </div>

  <v-alert
    v-else-if="state.status === 'error'"
    type="error"
    variant="tonal"
  >
    <p class="mb-3">
      {{ state.error || "Couldn't load rockets." }}
    </p>
    <v-btn
      color="error"
      variant="flat"
      @click="retry"
    >
      Retry
    </v-btn>
  </v-alert>

  <div v-else-if="!rocket">
    <v-alert
      type="warning"
      variant="tonal"
      class="mb-4"
    >
      Rocket not found. It may have been a rocket you added earlier that didn't
      survive a page refresh.
    </v-alert>
    <v-btn
      to="/"
      color="primary"
    >
      Back to rocket list
    </v-btn>
  </div>

  <v-card
    v-else
    max-width="640"
    class="mx-auto"
  >
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="ma-2"
    >
      Back to all rockets
    </v-btn>

    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
      :height="280"
    />

    <v-card-title class="text-h5">
      {{
        rocket.name || "Unnamed rocket"
      }}
    </v-card-title>
    <v-card-text>
      <p class="text-medium-emphasis mb-4">
        {{ formatText(rocket.description) }}
      </p>
      <v-divider class="mb-2" />
      <v-list density="comfortable">
        <v-list-item
          title="Cost per launch"
          :subtitle="formatCost(rocket.costPerLaunch)"
        />
        <v-list-item
          title="Country"
          :subtitle="formatText(rocket.country)"
        />
        <v-list-item
          title="First flight"
          :subtitle="formatDate(rocket.firstFlight)"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>
