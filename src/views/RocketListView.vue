<template>
  <v-main class="bg-[#07111f] min-h-screen">
    <v-container
      max-width="1180"
      class="px-7 py-0 mt-10"
    >
      <v-row
        align="center"
        justify="space-between"
        class="min-h-[420px]"
      >
        <v-col
          cols="12"
          md="8"
          class="position-relative"
        >
          <div class="mb-4">
            <div
              class="text-uppercase font-weight-bold"
              style="font-size: 11px; letter-spacing: 0.15em"
            >
              SpaceX launcher archive
            </div>
          </div>

          <p
            class="text-blue-grey-lighten-2 text-body-1 mt-6"
            style="max-width: 420px; line-height: 1.6"
          >
            A living catalogue of SpaceX launchers, powered by Launch Library 2.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      max-width="1180"
      class="px-7 pb-16"
    >
      <v-row
        align="end"
        justify="space-between"
        class="pt-7 pb-7"
        style="border-top: 1px solid #203449"
      >
        <v-col
          cols="12"
          md="auto"
        >
          <div
            class="text-uppercase font-weight-bold mb-4"
            style="font-size: 11px; letter-spacing: 0.15em"
          >
            The catalogue
          </div>

          <div class="d-flex align-center ga-2">
            <h2 class="text-white text-h5 font-weight-bold">
              All launchers
            </h2>

            <span
              v-if="store.status === 'success'"
              class="text-blue-grey-darken-1 font-weight-regular"
            >
              ({{ store.filteredRockets.length }})
            </span>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="auto"
        >
          <div class="d-flex ga-3 flex-column flex-md-row">
            <v-text-field
              v-model="store.query"
              prepend-inner-icon="mdi-magnify"
              label="Search rockets"
              variant="outlined"
              hide-details
              clearable
              width="250"
              height="56"
            />

            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-plus"
              width="250"
              height="56"
              @click="dialogOpen = true"
            >
              Add rocket
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-card
        v-if="store.status === 'loading'"
        min-height="280"
        color="transparent"
        elevation="0"
        class="d-flex flex-column align-center justify-center ga-3"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />

        <p class="text-blue-grey-lighten-2 mb-0">
          Scanning the launch archive...
        </p>
      </v-card>

      <v-card
        v-else-if="store.status === 'error'"
        min-height="280"
        color="transparent"
        elevation="0"
        rounded="lg"
        class="d-flex flex-column align-center justify-center ga-3 pa-6"
        border="dashed"
      >
        <v-icon
          size="42"
          color="error"
        >
          mdi-satellite-off
        </v-icon>

        <h2 class="text-white text-h6 mb-0">
          Connection interrupted
        </h2>

        <p class="text-blue-grey-lighten-2 text-center mb-2">
          {{ store.error }}
        </p>

        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="store.loadRockets(true)"
        >
          Retry
        </v-btn>
      </v-card>

      <v-row
        v-else-if="store.filteredRockets.length"
        dense
      >
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          class="d-flex"
        >
          <RocketCard
            :rocket="rocket"
            @select="openRocket"
          />
        </v-col>
      </v-row>

      <v-card
        v-else
        min-height="280"
        color="transparent"
        elevation="0"
        border="dashed"
        rounded="lg"
        class="d-flex flex-column align-center justify-center ga-3 pa-6"
      >
        <v-icon
          size="42"
          color="blue-grey-lighten-2"
        >
          mdi-radar
        </v-icon>

        <h2 class="text-white text-h6 mb-0">
          No rockets found
        </h2>

        <p class="text-blue-grey-lighten-2 mb-0">
          Try another search term.
        </p>
      </v-card>
    </v-container>

    <RocketFormDialog
      v-model="dialogOpen"
      @submit="store.addRocket"
    />
  </v-main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import RocketCard from "@/components/RocketCard.vue";
import RocketFormDialog from "@/components/RocketFormDialog.vue";
import { useRockets } from "@/composables/useRockets";
import type { Rocket } from "@/types/rocket";

const router = useRouter();
const store = useRockets();

const dialogOpen = ref(false);

const openRocket = (rocket: Rocket) => {
  void router.push({
    name: "rocket-detail",
    params: {
      id: rocket.id,
    },
  });
};
</script>
