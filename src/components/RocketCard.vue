<template>
  <v-card
    class="ma-3"
    width="400"
    style="cursor: pointer"
    @click="$router.push(`/rocket/${rocket.id}`)"
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(img, index) in rocket.flickr_images"
          :key="index"
          cols="6"
        >
          <v-img 
            :src="img"
            height="100px"
            class="rounded"
            cover
          />
        </v-col>
      </v-row>
    </v-container>

    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text>{{ rocket.description }}</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketCard } from '@/types/rocket';

defineProps<{ rocket: RocketCard }>();
</script>
