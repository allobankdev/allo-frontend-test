<template>
  <v-container
    v-if="rocket"
    class="py-5"
  >
    <v-btn
      color="warning"
      variant="flat"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="$router.push('/')"
    >
      Back to Rockets
    </v-btn>

    <v-row dense>
      <v-col
        v-for="(img, index) in rocket.flickr_images"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-img
          :src="img"
          height="200px"
          class="rounded"
          cover
        />
      </v-col>
    </v-row>

    <v-card
      class="mt-5 pa-5"
      elevation="3"
    >
      <h1 class="text-h5 font-weight-bold mb-3">
        {{ rocket.name }}
      </h1>
      <p class="mb-3">
        {{ rocket.description }}
      </p>

      <v-divider class="my-3" />

      <v-list dense>
        <v-list-item>
          <div>
            <span class="font-weight-medium">Cost per launch</span>
            <span>${{ rocket.cost_per_launch }}</span>
          </div>
        </v-list-item>

        <v-list-item>
          <div>
            <span class="font-weight-medium">Country</span>
            <span>{{ rocket.country }}</span>
          </div>
        </v-list-item>

        <v-list-item>
          <div>
            <span class="font-weight-medium">First flight</span>
            <span>{{ rocket.first_flight }}</span>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import type { Rocket } from "@/types/rocket";

const route = useRoute();
const rocket = ref<Rocket>();

onMounted(async () => {
  const res = await axios.get(
    `https://api.spacexdata.com/v4/rockets/${route.params.id}`
  );
  rocket.value = res.data;
});
</script>
