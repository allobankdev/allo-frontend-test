<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocket } from "@/store/rocketStore";
import Error from "@/components/Error.vue";

const route = useRoute();
const rocketStore = useRocket();
const rocketId = route.params.id as string;

onMounted(() => {
  rocketStore.fetchRocketById(rocketId);
});
</script>

<template>
  <v-container>
    <v-skeleton-loader
      v-if="rocketStore.loading"
      type="card"
    />

    <Error
      v-else-if="rocketStore.error"
      :error="rocketStore.error"
      @retry="rocketStore.fetchRocketById(rocketId)"
    />

    <div v-else-if="rocketStore.detail">
      <div class="d-flex ma-2 flex-row align-center justify-space-between my-1 ga-4">
        <h1>{{ rocketStore.detail.name }}</h1>
        <v-btn
          color="primary"
          @click="$router.back()"
        >
          Back
        </v-btn>
      </div>
      <div class="d-flex flex-column flex-md-row ga-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-window show-arrows>
            <v-window-item
              v-for="image in rocketStore.detail.flickr_images"
              :key="image"
            >
              <v-card
                class="d-flex justify-center align-center"
                height="400px"
              >
                <v-img
                  :src="image"
                  height="400px"
                  cover
                />
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="mt-2">
            <p>Country: {{ rocketStore.detail.country }}</p>
            <p>Cost per launch: {{ Number(rocketStore.detail.cost_per_launch).toLocaleString("id") }}</p>
            <p>First flight: {{ rocketStore.detail.first_flight }}</p>
            <p class="mt-2">
              Description:
            </p>
            <p>{{ rocketStore.detail.description }}</p>
            <div class="d-flex flex-row justify-space-between mt-4">
              <v-btn
                v-if="rocketStore.detail.wikipedia"
                color="primary"
                variant="tonal"
                target="_blank"
                :href="rocketStore.detail.wikipedia"
              >
                Wikipedia
              </v-btn>
              <v-chip
                :color="rocketStore.detail.active ? 'green' : 'red'"
                class="mr-2"
              >
                {{ rocketStore.detail.active ? 'Active' : 'Inactive' }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </div>
    </div>

    <div
      v-else
      class="d-flex flex-column text-center pa-10 ga-4"
    >
      <p>No data available</p>
    </div>
  </v-container>
</template>
