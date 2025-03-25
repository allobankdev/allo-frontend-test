<template>
  <v-row class="rocket-card">
    <v-col cols="3">
      <v-img :src="rocket.flickr_images[0]" alt="rocket image"/>
    </v-col>
    <v-col>
      <h3>{{ rocket.name }}</h3>
      <p>{{ rocket.description }}</p>
    </v-col>
  </v-row>
</template>

<script setup>
  defineProps({
    rocket: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped>
  .rocket-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
  }
</style>