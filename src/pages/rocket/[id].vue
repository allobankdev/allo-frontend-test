<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocket.store";

const route = useRoute();
const store = useRocketStore();

const { id } = route.params as { id: string };

onMounted(() => {
  store.fetchRocket(id);
});
</script>

<template>
  <v-container v-if="store.loading">
    <v-row>
      <v-col cols="12" md="4">
        <v-skeleton-loader type="image, article" height="260" />
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="store.selectedRocket">
    <v-img :src="store.selectedRocket.flickr_images[0]" height="300" cover />

    <h1 class="mt-4">{{ store.selectedRocket.name }}</h1>
    <p>{{ store.selectedRocket.description }}</p>

    <v-list class="mt-4">
      <v-list-item> Country: {{ store.selectedRocket.country }} </v-list-item>
      <v-list-item>
        Cost per launch: ${{ store.selectedRocket.cost_per_launch }}
      </v-list-item>
      <v-list-item>
        First flight: {{ store.selectedRocket.first_flight }}
      </v-list-item>
    </v-list>
  </v-container>
</template>
