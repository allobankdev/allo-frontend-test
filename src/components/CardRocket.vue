<script setup lang="ts">
import type { Rocket } from '../types/rocket';

defineProps<{
  rocket: Rocket;
}>();
</script>

<template>
  <v-card>
    <v-window show-arrows>
      <v-window-item
        v-for="image in rocket.flickr_images"
        :key="image"
      >
        <v-card
          class="d-flex justify-center align-center"
          height="300px"
        >
          <v-img
            :src="image"
            height="300px"
            cover
          />
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-subtitle>{{ rocket.company }} - {{ rocket.country }}</v-card-subtitle>
    <v-card-text>
      <p>
        {{ rocket.description.length > 130 ? rocket.description.substring(0, 130) + '...' : rocket.description }}
      </p>
    </v-card-text>

    <v-sheet class="d-flex justify-space-between align-center mb-2">
      <v-card-actions>
        <v-btn
          :to="`/${rocket.id}/detail`"
          color="primary"
        >
          View More
        </v-btn>
      </v-card-actions>
      <v-chip
        :color="rocket.active ? 'green' : 'red'"
        class="mr-2"
      >
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-sheet>
  </v-card>
</template>
