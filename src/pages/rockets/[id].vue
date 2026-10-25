<template>
  <v-container>
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <Header
        :title="`Rocket Details ${data?.full_name ? `- ${data.full_name}` : ''}`"
      >
        <v-btn
          icon="mdi-arrow-left"
          size="x-small"
          color="primary"
          @click="$router.push('/')"
        ></v-btn>
      </Header>

      <v-card variant="tonal" class="mb-4 pa-4">
        <p v-if="!rocketId" class="text-center">
          Data not found. Seems like the rocket ID is missing or invalid.
        </p>
        <p v-else-if="isLoading" class="text-center">Loading...</p>
        <div v-else-if="error" class="text-center">
          <p class="my-2">
            Error:
            {{ error?.message || error || "An unknown error occurred" }}
          </p>
          <v-btn size="small" variant="tonal" @click="refetch" class="mb-3">
            Retry
          </v-btn>
        </div>
        <p v-else-if="!data">No data available.</p>
        <div v-else-if="data">
          <v-row>
            <v-col cols="12" sm="3">
              <v-img
                v-if="data.image_url"
                :src="data.image_url"
                aspect-ratio="1"
                alt="Rocket Image"
                class="rounded-circle"
                cover
              ></v-img>
              <div
                v-else
                class="d-flex justify-center align-center text-disabled"
                style="height: 100%"
              >
                No Image
              </div>
            </v-col>
            <v-col cols="12" sm="9">
              <h3 class="mb-2">{{ data.full_name }}</h3>
              <p class="mb-2">
                <span v-if="data?.description">{{ data.description }}</span>
                <span v-else class="text-disabled"
                  ><i>No description available</i></span
                >
              </p>
              <p class="mb-2">
                <strong>Cost Per Launch: </strong>
                <span v-if="data?.launch_cost">{{ data.launch_cost }}</span>
                <span v-else class="text-disabled"><i>Not available</i></span>
              </p>
              <p class="mb-2">
                <strong>Country: </strong>
                <span v-if="data?.manufacturer?.country_code">{{
                  data.manufacturer?.country_code
                }}</span>
                <span v-else class="text-disabled"><i>Not available</i></span>
              </p>
              <p class="mb-2">
                <strong>First Flight: </strong>
                <span v-if="data?.maiden_flight">{{ data.maiden_flight }}</span>
                <span v-else class="text-disabled"><i>Not available</i></span>
              </p>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useSimpleFetch } from "@/composables/useSimpleFetch";
import type { RocketData } from "@/types";
import { useRoute } from "vue-router";

const route = useRoute();
const rawId = route.params.id;
const isValidId = rawId && rawId !== "undefined";
const rocketId = isValidId ? rawId : "";

const { data, isLoading, error, refetch } = useSimpleFetch<RocketData>(
  `/launcher/${rocketId}`,
  { immediate: !!rocketId },
);
</script>
