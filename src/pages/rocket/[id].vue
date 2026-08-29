<template>
  <v-container>
    <h1>Rocket Detail</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else-if="isError">Failed to load rocket detail</div>
    <template v-else>
      <div v-if="data">
        <v-row v-if="data.flickr_images.length" :gap="4">
          <v-col
            v-for="img in data.flickr_images"
            :key="img"
            cols="12"
            sm="4"
            spacing="4"
          >
            <v-img :src="img" height="300" contain></v-img>
          </v-col>
        </v-row>
        <div>
          <h2>Name: {{ data.name }}</h2>
          <p>First Flight: {{ data.first_flight }}</p>
          <p>Country: {{ data.country }}</p>
          <p>Cost per launch: {{ formatCurrency(data.cost_per_launch) }}</p>
        </div>
        <div>
          <p><strong> Description: </strong></p>
          <p>{{ data?.description }}</p>
        </div>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useDetailRocketQuery } from "../../features/rocket/queries/rocket.query";
import { formatCurrency } from "../../lib/utils";

const route = useRoute();

const { data, isLoading, isError } = useDetailRocketQuery(
  route.params.id as string
);
</script>
