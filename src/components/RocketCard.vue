<template>
  <v-card 
    class="h-100 d-flex flex-column rocket-card"
    :hover="true"
    :style="{ borderLeft: `4px solid ${statusColor}` }"
    @click="goToDetail"
  >
    <!-- Rocket Image -->
    <v-img
      :src="rocketImage"
      height="200"
      cover
      class="align-end"
      gradient="to top, rgba(0,0,0,0.7), rgba(0,0,0,0)"
    >
      <!-- Status Badge -->
      <v-chip 
        class="ma-2" 
        :color="rocket.active ? 'green' : 'grey'"
        size="small"
        label
      >
        <v-icon
          start
          size="small"
        >
          {{ rocket.active ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-img>

    <!-- Rocket Info -->
    <v-card-title class="text-h6 font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle class="d-flex align-center">
      <v-icon
        size="small"
        class="mr-1"
      >
        mdi-earth
      </v-icon>
      {{ rocket.country }}
      <v-spacer />
      <v-icon
        size="small"
        class="mr-1"
      >
        mdi-cash
      </v-icon>
      ${{ (rocket.cost_per_launch / 1000000).toFixed(1) }}M
    </v-card-subtitle>

    <v-card-text class="flex-grow-1">
      <div class="text-body-2 text-truncate-3">
        {{ rocket.description }}
      </div>
      
      <!-- Stats -->
      <v-row
        class="mt-4"
        dense
      >
        <v-col cols="6">
          <div class="text-caption text-grey">
            Success Rate
          </div>
          <div class="text-h6 font-weight-bold">
            {{ rocket.success_rate_pct }}%
          </div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-grey">
            First Flight
          </div>
          <div class="text-subtitle-2">
            {{ formatDate(rocket.first_flight) }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn 
        color="primary" 
        variant="text" 
        block
        @click.stop="goToDetail"
      >
        View Details
        <v-icon end>
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Rocket } from '@/types/rocket';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const rocketImage = computed(() => {
  return props.rocket.flickr_images[0] || 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop';
});

const statusColor = computed(() => {
  return props.rocket.active ? '#4CAF50' : '#9E9E9E';
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const goToDetail = () => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<style scoped>
.rocket-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>