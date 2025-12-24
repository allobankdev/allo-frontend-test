<template>
    <v-card 
      class="rocket-card" 
      @click="showDetailRocket"
      :ripple="false"
      >
      <v-img 
        :src="rocketImage"
        :alt="rocket.name || ''"
        height="200"
        cover
        class="rocket-card-image"
      />
      <v-card-title class="text-h6 font-weight-bold">
        {{ rocket.name || '-' }}
      </v-card-title>

      <v-card-text class="flex-grow-1">
      <div class="text-body-2 text-truncate">
        {{ rocket.description || '-' }}
      </div>

      <!-- <v-row
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
      </v-row> -->
    </v-card-text>

      
    </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
   import type { Rocket } from '@/types/rocket';
   import { useRouter } from 'vue-router';
   const router = useRouter();

   const props = defineProps<{
    rocket: Rocket;
   }>();

   const rocketImage = computed(() => {
    return props.rocket?.flickr_images[0] || 'https://placehold.co/300x300';
   })

   const showDetailRocket = () => {
    router.push(`/rockets/${props.rocket.id}`);
   }

</script>

<style scoped>
.rocket-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}
.rocket-card:hover {
  transform: translateY(-2px);
}
.text-truncate {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>