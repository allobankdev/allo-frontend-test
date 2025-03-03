<template>
  <v-card>
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
</template>

<script lang="ts">
export default {
  props: {
    rocket: {
      type: Object,
      required: true,
    },
  },
};
</script>
