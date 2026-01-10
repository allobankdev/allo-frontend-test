<template>
  <v-card color="#212121">
    <div
      class="d-flex flex-column flex-md-row flex-no-wrap justify-space-between"
    >
      <div>
        <v-card-title class="text-h5"> {{ props.rocket.name }} </v-card-title>

        <v-card-text class="text-grey-lighten-1">
          {{ props.rocket.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            :to="{
              name: `/rocket/[id]`,
              params: {
                id: props.rocket.id,
              },
            }"
            class="ms-2"
            size="small"
            text="Learn More"
            variant="outlined"
            append-icon="mdi-chevron-right"
          />
        </v-card-actions>
      </div>

      <div class="wrapper-image mt-3 mt-md-0">
        <v-carousel cycle show-arrows="hover" height="300">
          <v-carousel-item
            v-for="image in props.rocket.flickr_images"
            :key="image"
            :src="image"
            cover
          />
        </v-carousel>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from "../../types/rocket";

const props = defineProps<{ rocket: Rocket }>();
</script>

<style scoped>
.wrapper-image {
  width: 100%;
}

@media (min-width: 960px) {
  .wrapper-image {
    min-width: 300px;
    max-width: 300px;
  }
}
</style>
