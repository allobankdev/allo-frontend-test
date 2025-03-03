<template>
  <v-card
    class="cursor-pointer"
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images[0]"
      height="200"
      cover
    />
    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-subtitle>{{ rocket.first_flight }}</v-card-subtitle>
    <v-card-text>{{ rocket.description }}</v-card-text>
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

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
