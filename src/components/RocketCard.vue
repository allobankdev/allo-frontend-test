<template>
  <v-card
    elevation="2"
    class="ma-2 rocket-card"
  >
    <v-img
      :src="image" 
      :alt="rocket.name" 
      height="200px"
      cover
      class="rocket-image"
    >
      <v-chip
        v-if="rocket.active"
        class="ma-2"
        color="success"
        size="small"
      >
        Active
      </v-chip>
    </v-img>
    
    <v-card-title class="text-h6 font-weight-bold">
      {{ rocket.name }}
    </v-card-title>
    
    <v-card-subtitle class="d-flex align-center">
      <v-icon
        small
        class="mr-1"
      >
        mdi-map-marker
      </v-icon>
      {{ rocket.country }}
      <v-spacer />
      <v-icon
        small
        class="mr-1"
      >
        mdi-rocket
      </v-icon>
      {{ rocket.company }}
    </v-card-subtitle>
    
    <v-card-text class="py-2">
      <div class="text-body-2 text-truncate-2 mb-2">
        {{ rocket.description }}
      </div>
      
      <v-divider class="my-2" />
      
      <div class="d-flex justify-space-between text-caption text-medium-emphasis">
        <div class="text-center">
          <div>First Flight</div>
          <div class="font-weight-medium">
            {{ formatDate(rocket.first_flight) }}
          </div>
        </div>
        <v-divider vertical />
        <div class="text-center">
          <div>Cost/Launch</div>
          <div class="font-weight-medium">
            ${{ rocket.cost_per_launch.toLocaleString() }}
          </div>
        </div>
        <v-divider vertical />
        <div class="text-center">
          <div>Success Rate</div>
          <div class="font-weight-medium">
            {{ rocket.success_rate_pct }}%
          </div>
        </div>
      </div>
    </v-card-text>
    
    <v-card-actions>
      <v-btn
        :href="rocket.wikipedia"
        target="_blank"
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-wikipedia"
      >
        Learn More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Rocket } from '@/types/rocket';

const props = defineProps<{ rocket: Rocket }>();
const image = computed(() => 
  props.rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
);

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>