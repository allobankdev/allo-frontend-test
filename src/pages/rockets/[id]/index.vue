<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <!-- Loading -->
        <SkeletonLoader
          v-if="isLoading"
          type="card, article, article"
          elevation="2"
        />

        <!-- Error -->
        <ErrorComponent
          v-else-if="error"
          @refresh="refetch"
        />

        <!-- Data Loaded -->
        <v-card
          v-else-if="data"
          elevation="2"
          class="rounded-xl"
        >
          <!-- Custom rocket badge -->
          <v-chip
            v-if="data.data.id.startsWith('custom_')"
            class="custom-rocket-badge"
            color="secondary"
            prepend-icon="mdi-star"
          >
            Custom Rocket
          </v-chip>

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
            <v-chip
              v-if="data.data.company"
              class="ml-2"
              size="small"
              variant="outlined"
            >
              {{ data.data.company }}
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-1 mb-6">
              {{ data.data.description }}
            </p>

            <v-row>
              <v-col
                cols="6"
                sm="4"
              >
                <StatCard
                  title="First Flight"
                  :value="formatDate(data.data.first_flight)"
                  icon="mdi-calendar"
                />
              </v-col>
              <v-col
                cols="6"
                sm="4"
              >
                <StatCard
                  title="Cost per Launch"
                  :value="'$' + data.data.cost_per_launch.toLocaleString()"
                  icon="mdi-cash"
                />
              </v-col>
              <v-col
                cols="6"
                sm="4"
              >
                <StatCard
                  title="Success Rate"
                  :value="data.data.success_rate_pct + '%'"
                  icon="mdi-trending-up"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div
              class="d-flex justify-space-between align-center flex-wrap gap-3"
            >
              <v-btn
                v-if="data.data.wikipedia"
                color="primary"
                :href="data.data.wikipedia"
                target="_blank"
                prepend-icon="mdi-wikipedia"
                size="large"
              >
                Wikipedia Page
              </v-btn>
              <div v-else />

              <v-chip-group>
                <v-chip
                  v-if="data.data.active"
                  color="success"
                  prepend-icon="mdi-check-circle"
                >
                  Active
                </v-chip>
                <v-chip
                  v-else
                  color="error"
                  prepend-icon="mdi-close-circle"
                >
                  Inactive
                </v-chip>
                <v-chip prepend-icon="mdi-calendar">
                  First Flight: {{ formatDate(data.data.first_flight) }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>
        <GoBackButton class="my-5" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { formatDate } from "@/utils/helper";
import { useRocketsStore } from "@/stores/rockets.store";

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
  position: relative;

  &-title {
    word-break: break-word;
  }
}

.custom-rocket-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}

.v-carousel {
  border-radius: 12px 12px 0 0 !important;
}

.stat-card {
  border-radius: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &__title {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
  }

  &__value {
    font-size: 1.25rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.87);
  }
}

.gap-3 {
  gap: 12px;
}

@media (max-width: 600px) {
  .d-flex.justify-space-between {
    flex-direction: column;
    align-items: stretch;

    .v-btn {
      margin-bottom: 16px;
    }
  }
}
</style>
