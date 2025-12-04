<template>
  <div>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isLoading"
      type="image, heading, paragraph"
      class="mx-auto"
      max-width="800"
    />

    <!-- Content -->
    <div v-else class="mx-auto" style="max-width: 800px">
      <!-- Title -->
      <h1 class="mb-4">{{ data?.name }}</h1>

      <!-- Description -->
      <p class="text-body-1 mb-6">{{ data?.description }}</p>

      <!-- Images -->
      <v-carousel height="350" hide-delimiters>
        <v-carousel-item
          v-for="(img, i) in data?.flickr_images"
          :key="i"
          :src="img"
          cover
        />
      </v-carousel>

      <!-- Summary Info -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Rocket Information</h2>

        <v-row>
          <v-col cols="6">
            <strong>Active:</strong> {{ data?.active ? "Yes" : "No" }}
          </v-col>
          <v-col cols="6">
            <strong>Country:</strong> {{ data?.country }}
          </v-col>
          <v-col cols="6">
            <strong>Company:</strong> {{ data?.company }}
          </v-col>
          <v-col cols="6">
            <strong>First Flight:</strong> {{ data?.first_flight }}
          </v-col>
          <v-col cols="6">
            <strong>Cost per Launch:</strong> ${{
              data?.cost_per_launch.toLocaleString()
            }}
          </v-col>
          <v-col cols="6">
            <strong>Success Rate:</strong> {{ data?.success_rate_pct }}%
          </v-col>
        </v-row>
      </v-card>

      <!-- Dimensions -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Dimensions</h2>

        <v-row>
          <v-col cols="6">
            <strong>Height:</strong> {{ data?.height.meters }} m
          </v-col>
          <v-col cols="6">
            <strong>Diameter:</strong> {{ data?.diameter.meters }} m
          </v-col>
          <v-col cols="6">
            <strong>Mass:</strong> {{ data?.mass.kg }} kg
          </v-col>
        </v-row>
      </v-card>

      <!-- Stage 1 -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">First Stage</h2>

        <v-row>
          <v-col cols="6">
            <strong>Engines:</strong> {{ data?.first_stage.engines }}
          </v-col>
          <v-col cols="6">
            <strong>Reusable:</strong>
            {{ data?.first_stage.reusable ? "Yes" : "No" }}
          </v-col>
          <v-col cols="6">
            <strong>Fuel:</strong> {{ data?.first_stage.fuel_amount_tons }} tons
          </v-col>
          <v-col cols="6">
            <strong>Burn Time:</strong>
            {{ data?.first_stage.burn_time_sec }} sec
          </v-col>
        </v-row>
      </v-card>

      <!-- Stage 2 -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Second Stage</h2>

        <v-row>
          <v-col cols="6">
            <strong>Engines:</strong> {{ data?.second_stage.engines }}
          </v-col>
          <v-col cols="6">
            <strong>Reusable:</strong>
            {{ data?.second_stage.reusable ? "Yes" : "No" }}
          </v-col>
          <v-col cols="6">
            <strong>Fuel:</strong>
            {{ data?.second_stage.fuel_amount_tons }} tons
          </v-col>
          <v-col cols="6">
            <strong>Burn Time:</strong>
            {{ data?.second_stage.burn_time_sec }} sec
          </v-col>
        </v-row>
      </v-card>

      <!-- Engines -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Engine Info</h2>

        <v-row>
          <v-col cols="6">
            <strong>Type:</strong> {{ data?.engines.type }}
          </v-col>
          <v-col cols="6">
            <strong>Version:</strong> {{ data?.engines.version }}
          </v-col>

          <v-col cols="6">
            <strong>Thrust (Sea):</strong>
            {{ data?.engines.thrust_sea_level.kN }} kN
          </v-col>
          <v-col cols="6">
            <strong>Thrust (Vacuum):</strong>
            {{ data?.engines.thrust_vacuum.kN }} kN
          </v-col>
        </v-row>
      </v-card>

      <!-- Payload -->
      <v-card class="mt-6 pa-4">
        <h2 class="text-h6 mb-3">Payload Capacity</h2>

        <v-list lines="one" class="pa-0">
          <v-list-item
            class="pa-0"
            v-for="pl in data?.payload_weights"
            :key="pl.id"
            >{{ pl.name }} — {{ pl.kg }} kg</v-list-item
          >
        </v-list>
      </v-card>

      <!-- Wikipedia -->
      <div class="mt-6">
        <v-btn color="primary" :href="data?.wikipedia" target="_blank">
          View on Wikipedia
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOneRocket } from "@/services/rocket";
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

const route = useRoute();
const rocketId = route.params.id;

const { data, isLoading } = useQuery({
  queryKey: ["rocket"],
  queryFn: () => getOneRocket(rocketId),
});
</script>
