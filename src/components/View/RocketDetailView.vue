<script setup lang="ts">
import { computed } from "vue";
import type { Rocket } from "@/types/rocketTypes";

const props = defineProps<{
  rocket: Rocket;
}>();

const formattedCost = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(props.rocket.cost_per_launch);
});

const formattedDate = computed(() => {
  return new Date(props.rocket.first_flight).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <v-container class="rocket-detail-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="rocket-detail-card" elevation="4">
          <v-img
            :src="
              rocket.flickr_images[0] ||
              'https://static.vecteezy.com/system/resources/previews/011/020/178/non_2x/simple-outline-rocket-icon-sign-illustration-free-vector.jpg'
            "
            height="300"
            cover
            class="detail-image"
            :alt="`Detailed image of ${rocket.name} rocket`"
            :lazy-src="'https://via.placeholder.com/600x300?text=Loading'"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary" size="48" />
              </v-row>
            </template>
          </v-img>

          <v-card-title class="text-h4 font-weight-bold detail-title">
            <v-icon left color="primary"> mdi-rocket-launch </v-icon>
            {{ props.rocket.name }}
          </v-card-title>

          <v-card-subtitle class="text-h6 detail-subtitle">
            <v-icon left color="secondary" size="small"> mdi-earth </v-icon>
            {{ props.rocket.country }}
          </v-card-subtitle>

          <v-divider class="mx-4" />

          <v-card-text>
            <v-row class="detail-info">
              <v-col cols="12" md="6">
                <v-list density="comfortable" class="detail-list" lines="two">
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-currency-usd" class="info-icon" />
                    </template>
                    <v-list-item-title>Cost per Launch</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formattedCost }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-calendar" class="info-icon" />
                    </template>
                    <v-list-item-title>First Flight</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formattedDate }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="rocket.active !== undefined">
                    <template #prepend>
                      <v-icon
                        :icon="
                          rocket.active
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        "
                        :color="rocket.active ? 'success' : 'error'"
                        class="info-icon"
                      />
                    </template>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ rocket.active ? "Active" : "Inactive" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <div class="description-section">
                  <h3 class="text-h6 font-weight-medium description-title">
                    <v-icon left color="primary" size="small">
                      mdi-information
                    </v-icon>
                    Description
                  </h3>
                  <p class="description-text text-body-1">
                    {{ props.rocket.description }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider class="mx-4" />

          <v-card-actions class="detail-actions">
            <v-btn
              color="primary"
              variant="elevated"
              class="back-button"
              aria-label="Go back to rocket list"
              @click="$router.go(-1)"
            >
              <v-icon left icon="mdi-arrow-left" />
              Back to List
            </v-btn>

            <v-spacer />

            <v-btn
              color="secondary"
              variant="outlined"
              aria-label="Close details"
              @click="$router.go(-1)"
            >
              <v-icon left icon="mdi-close" />
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
@use "../../styles/settings.scss" as *;

.rocket-detail-container {
  padding: $spacing-lg 0;
  animation: slide-in 0.3s ease-out;
}

.rocket-detail-card {
  border-radius: $border-radius-lg;
  overflow: hidden;
  background: $bg-surface;

  .detail-image {
    @include gradient-overlay(rgba(0, 0, 0, 0.5), to top);
    border-bottom: 1px solid $border-color;
  }

  .detail-title {
    padding-top: $spacing-lg;
    padding-bottom: $spacing-sm;
    color: $primary-light;
    word-break: break-word;
  }

  .detail-subtitle {
    padding-bottom: $spacing-md;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .detail-info {
    padding: $spacing-md 0;
  }

  .info-icon {
    margin-right: $spacing-sm;
    color: $primary-light;
  }

  .description-section {
    padding: 0 $spacing-sm;

    .description-title {
      color: $primary-light;
      margin-bottom: $spacing-md;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    .description-text {
      color: $text-primary;
      line-height: $line-height-base;
    }
  }

  .detail-actions {
    padding: $spacing-md;
    background: rgba($bg-dark, 0.1);
  }

  .back-button {
    margin-right: $spacing-sm;
  }
}
</style>
