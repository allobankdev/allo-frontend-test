<template>
  <v-container>
    <v-card v-if="rocket">
      <v-img
        :src="rocket.flickr_images[0]"
        height="300"
        cover
      />
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-subtitle>{{ rocket.first_flight }}</v-card-subtitle>
      <v-card-text>
        <p>Description: {{ rocket.description }}</p>
        <p>Cost per Launch: ${{ rocket.cost_per_launch }}</p>
        <p>Country: {{ rocket.country }}</p>
        <p>First Flight: {{ rocket.first_flight }}</p>
      </v-card-text>
    </v-card>

    <div v-else>
      Rocket not found.
    </div>

    <v-btn
      text="Back"
      color="primary"
      class="mb-4"
      @click="$router.go(-1)"
    />
  </v-container>
</template>

<script lang="ts">
import { useRocketStore } from "@/store/rocketStore";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const rocketStore = useRocketStore();

    const rocket =
      rocketStore.rockets.find((r) => r.id === props.id)


    return {
      rocket,
    };
  },
};
</script>
