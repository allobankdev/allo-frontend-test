<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Loading -->
        <SkeletonLoader
          v-if="isLoading"
          type="card, article, article"
          elevation="2"
        />

        <!-- Error -->
        <ErrorComponent v-else-if="error" @refresh="refetch" />

        <!-- Data Loaded -->
        <v-card v-else-if="data" elevation="2" class="rounded-xl">
          <!-- Image Gallery -->
          <v-carousel
            v-if="data.data.flickr_images.length > 0"
            cycle
            height="400"
            hide-delimiters
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(image, i) in data.data.flickr_images"
              :key="i"
              :src="image"
              cover
            />
          </v-carousel>
          <v-img
            v-else
            src="https://via.placeholder.com/800x400?text=No+Image+Available"
            height="400"
            cover
          />

          <v-card-title class="text-h4 font-weight-bold pt-6">
            {{ data.data.name }}
            <v-chip
              :color="data.data.active ? 'success' : 'error'"
              class="ml-2"
              small
            >
              {{ data.data.active ? "ACTIVE" : "INACTIVE" }}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="text-h6">
            {{ data.data.country }}
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-1 mb-6">
              {{ data.data.description }}
            </p>

            <v-row>
              <v-col cols="6" sm="4">
                <div
                  class="stat-card"
                  title="First Flight"
                  :value="formatDate(data.data.first_flight)"
                  icon="mdi-calendar"
                />
              </v-col>
              <v-col cols="6" sm="4">
                <div
                  class="stat-card"
                  title="Cost per Launch"
                  :value="'$' + data.data.cost_per_launch.toLocaleString()"
                  icon="mdi-cash"
                />
              </v-col>
              <v-col cols="6" sm="4">
                <div
                  class="stat-card"
                  title="Success Rate"
                  :value="data.data.success_rate_pct + '%'"
                  icon="mdi-trending-up"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between align-center">
              <v-btn
                color="primary"
                :href="data.data.wikipedia"
                target="_blank"
                prepend-icon="mdi-wikipedia"
                size="large"
              >
                Wikipedia Page
              </v-btn>

              <v-chip-group>
                <v-chip
                  v-if="data.data.active"
                  color="success"
                  prepend-icon="mdi-check-circle"
                >
                  Active
                </v-chip>
                <v-chip v-else color="error" prepend-icon="mdi-close-circle">
                  Inactive
                </v-chip>
                <v-chip prepend-icon="mdi-calendar">
                  First Flight: {{ formatDate(data.data.first_flight) }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { formatDate } from "@/utils/helper";
import { useRocketsStore } from "@/store/rockets.store";

const route = useRoute();
const rocketId = route.params.id as string;
const rocketsStore = useRocketsStore();

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["rocket", rocketId],
  queryFn: () => rocketsStore.getRocketById(rocketId),
});
</script>

<style lang="scss" scoped>
.v-card {
  overflow: hidden;

  &-title {
    word-break: break-word;
  }
}

.v-carousel {
  border-radius: 12px 12px 0 0 !important;
}

.stat-card {
  border-radius: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  height: 100%;

  &__title {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
  }

  &__value {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.v-expansion-panel-title {
  display: flex;
  gap: 1rem;
}
</style>
