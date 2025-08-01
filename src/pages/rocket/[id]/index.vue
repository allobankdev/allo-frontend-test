<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Loading -->
        <v-skeleton-loader
          type="card"
          elevation="2"
          height="300px"
          v-if="isLoading"
        />
        <!-- Error -->
        <error-component v-else-if="error" />
        <!-- Data Loaded -->
        <v-card v-else-if="data" elevation="2">
          <v-img :src="data.data.flickr_images[0]" height="300px" cover />

          <v-card-title class="text-h5">
            {{ data.data.name }} - {{ data.data.type }}
          </v-card-title>

          <v-card-subtitle>
            {{ data.data.country }} | {{ data.data.company }} | First flight:
            {{ formatDate(data.data.first_flight) }}
          </v-card-subtitle>

          <v-card-text>
            <p>{{ data.data.description }}</p>

            <v-divider class="my-4" />

            <v-row dense>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Height</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.data.height.meters }} m /
                    {{ data.data.height.feet }} ft
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Diameter</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.data.diameter.meters }} m /
                    {{ data.data.diameter.feet }} ft
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Mass</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.data.mass.kg }} kg / {{ data.data.mass.lb }} lb
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Engines</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.data.engines.number }}x
                    {{ data.data.engines.type }} ({{
                      data.data.engines.version
                    }})
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Cost per Launch</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    ${{ data.data.cost_per_launch.toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Success Rate</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.data.success_rate_pct }}%
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-btn color="primary" :href="data.data.wikipedia" target="_blank">
              Buka Wikipedia
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import apiInstance from "@/utils/api";
import type { Rocket } from "@/types/rocket.type";

const route = useRoute();
const rocketId = route.params.id;

const fetchRocket = async () => {
  const response = await apiInstance.get<Rocket>(`/v4/rockets/${rocketId}`);
  return { data: response.data };
};

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["rocket", rocketId],
  queryFn: fetchRocket,
});

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>
