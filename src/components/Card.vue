<script setup lang="ts">
import { computed } from 'vue';
import type { Rocket } from '@/stores/Rockets/model';

const props = defineProps<{ rocket: Rocket }>();
const image = computed(() => 
  props.rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
);

</script>

<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="image"
      cover
    >
      <v-card-title>{{ rocket.name }}</v-card-title>
    </v-img>
    
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon
          size="18"
          class="mr-2"
          color="primary"
        >
          mdi-earth
        </v-icon>
        <span>{{ rocket.country }}</span>
      </div>

      <div class="d-flex align-center">
        <v-icon
          size="18"
          class="mr-2"
          color="primary"
        >
          mdi-domain
        </v-icon>
        <span>{{ rocket.company }}</span>
      </div>
    </v-card-text>

    <div class="text-body-2 truncate-2 mb-2 px-4">
      {{ rocket.description }}
    </div>
  </v-card>
</template>

<style scoped>
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>