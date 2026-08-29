<template>
  <v-container class="py-4 py-sm-6">
    <div class="d-flex align-center ga-2 mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" />
      <div class="text-h6 font-weight-bold">Rocket detail</div>
    </div>

    <v-progress-linear
      v-if="status === 'loading' && !rocket"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <UiErrorRetry
      v-if="status === 'error' && !rocket"
      :message="error"
      @retry="reload(true)"
    />

    <v-card v-else-if="rocket" rounded="lg" variant="outlined">
      <RocketImageGallery
        :images="rocket.flickr_images"
        :fallback-src="fallbackImageUrl"
        :height="heroHeight"
      />

      <v-card-item>
        <v-card-title class="d-flex align-center ga-2">
          <span class="text-truncate">{{ rocket.name }}</span>

          <v-chip
            v-if="rocket.source === 'local'"
            size="x-small"
            variant="tonal"
            color="primary"
            label
          >
            LOCAL
          </v-chip>
        </v-card-title>
        <v-card-subtitle class="text-truncate">
          {{ rocket.country }}
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="text-body-2">
        <p class="mb-4">{{ rocket.description }}</p>

        <v-row dense>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis">Cost per launch</div>
            <div class="text-subtitle-1 font-weight-medium">
              {{ formatUsd(rocket.cost_per_launch) }}
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis">Country</div>
            <div class="text-subtitle-1 font-weight-medium">
              {{ rocket.country }}
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis">First flight</div>
            <div class="text-subtitle-1 font-weight-medium">
              {{ formatDate(rocket.first_flight) }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="text-subtitle-2">Details</div>
          <v-btn
            variant="text"
            density="comfortable"
            :prepend-icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="showDetails = !showDetails"
          >
            {{ showDetails ? "Hide details" : "Show more" }}
          </v-btn>
        </div>

        <v-expand-transition>
          <div v-show="showDetails">
            <v-row v-if="specSections.length" dense class="mt-2">
              <v-col
                v-for="section in specSections"
                :key="section.title"
                cols="12"
                :md="section.md"
              >
                <KeyValueSection
                  :title="section.title"
                  :items="section.items"
                />
              </v-col>
            </v-row>

            <div v-else class="text-body-2 text-medium-emphasis mt-2">
              No additional details.
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-if="rocket.wikipedia"
          :href="rocket.wikipedia"
          target="_blank"
          rel="noopener noreferrer"
          variant="text"
          append-icon="mdi-open-in-new"
        >
          Wikipedia
        </v-btn>

        <v-spacer />

        <v-btn v-if="status === 'loading'" variant="text" disabled>
          Refreshing…
        </v-btn>
        <v-btn
          v-else
          variant="text"
          prepend-icon="mdi-refresh"
          @click="reload(true)"
        >
          Refresh
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-else class="text-body-2 text-medium-emphasis">Rocket not found.</div>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "RocketDetailPage",
};
</script>

<script setup lang="ts">
import { useRocketDetailPage } from "@/composables/pages/useRocketDetailPage";

const {
  fallbackImageUrl,
  heroHeight,
  rocket,
  status,
  error,
  showDetails,
  specSections,
  reload,
  goBack,
  formatDate,
  formatUsd,
} = useRocketDetailPage();
</script>
