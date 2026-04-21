<template>
  <v-container>
    <v-btn prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">
      Back
    </v-btn>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate />
    </v-row>

    <v-row v-if="rocket">
      <v-col cols="12" md="6">
        <v-carousel height="400" show-arrows="hover" hide-delimiters>
          <v-carousel-item
            v-for="(image, index) in rocket.flickr_images"
            :key="index"
          >
            <v-img :src="image" height="400" cover />
          </v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-2">
          {{ rocket.name }}
        </h1>

        <p class="text-subtitle-1 mb-4">
          {{ rocket.description }}
        </p>

        <v-divider class="mb-4" />

        <v-row>
          <v-col cols="6">
            <strong>Country</strong>
            <p>{{ rocket.country }}</p>
          </v-col>

          <v-col cols="6">
            <strong>First Flight</strong>
            <p>{{ rocket.first_flight }}</p>
          </v-col>

          <v-col cols="6">
            <strong>Cost Per Launch</strong>
            <p>
              $
              {{ rocket.cost_per_launch?.toLocaleString() }}
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/store/index";
import { storeToRefs } from "pinia";

const route = useRoute();

const { fetchRocketDetail } = useRocketStore();
const { rocket, loading } = storeToRefs(useRocketStore());

onMounted(() => {
  fetchRocketDetail(route.params.id as string);
});
</script>
