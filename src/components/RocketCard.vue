<template>
    <v-card @click="$emit('click')">
      <v-img :src="rocket.flickr_images[0]" height="200" />
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-text>{{ rocket.description }}</v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  defineProps<{ rocket: any }>()
  </script>