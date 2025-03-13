<script setup lang="ts">
import {  onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/stores/useRocketStore";

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

onMounted(() => {
  rocketStore.fetchRocketDetail(route.params.id)
});
</script>

<template>
  <v-container>
    <v-row>
      <div class="d-flex justify-center">
        <p
          v-if="rocketStore.error"
          style="color: red"
        >
          {{ rocketStore.error }}
          <v-btn
            variant="outlined"
            @click="rocketStore.fetchRocketDetail(route.params.id)"
          >
            <v-icon>mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </p>
        <v-progress-circular
          v-if="rocketStore.loading"
          indeterminate
        />
      </div>
      <v-col
        v-if="rocketStore.rockets && !rocketStore.loading"
        cols="12"
      >
        <v-row>
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <h1>{{ rocketStore.rocket?.name }}</h1>
              <v-btn
                variant="outlined"
                @click="router.push('/')"
              >
                <v-icon color="white">
                  mdi-chevron-left
                </v-icon> Back
              </v-btn>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-img
              :src="rocketStore.rocket?.flickr_images[0]"
              alt="Rocket Image"
              rounded="lg"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div
              class="d-flex flex-column"
              style="gap: 1rem;"
            >
              <h3>Description:</h3>
              <p class="text-justify">
                {{ rocketStore.rocket?.description }}
              </p>

              <h3>Cost Per Launch:</h3>
              <p>{{ rocketStore.rocket?.cost_per_launch }}</p>

              <h3>Country:</h3>
              <p>{{ rocketStore.rocket?.country }}</p>

              <h3>First Flight:</h3>
              <p>{{ rocketStore.rocket?.first_flight }}</p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
