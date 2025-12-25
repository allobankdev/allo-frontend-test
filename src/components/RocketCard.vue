<template>
    <v-card 
      class="rocket-card" 
      @click="showDetailRocket"
      :ripple="false"
      >
      <v-img 
        :src="rocketImage"
        :alt="rocket.name || ''"
        height="210"
        cover
        class="rocket-card-image"
      />
      <v-card-title class="text-h6 font-weight-bold d-flex align-center justify-space-between">
        <span>{{ rocket.name || '-' }}</span>
        <v-chip
          :color="rocket.active ? 'success' : 'error'"
          size="small"
          variant="flat"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
      </v-card-title>

      <v-card-text class="mt-3">
        <v-row align="center" justify="space-between">
          <v-col
            cols="12" 
            md="8"
            class="d-flex"
          >
            <v-icon
              size="small"
              icon="mdi-earth"
              class="mr-2"
              />
            <div class="text-body-2">
              {{ rocket.country || '-' }}
            </div>
          </v-col>

          <v-col 
            cols="12" 
            md="4"
            class="d-flex"
          >
            <v-icon
              size="small"
              icon="mdi-domain"
              class="mr-2"
              />
            <div class="text-body-2">
              {{ rocket.company || '-' }}
            </div>
          </v-col>

          <v-col 
            cols="12" 
            md="8"
            class="d-flex"
          >
            <v-icon
              size="small"
              icon="mdi-rocket-launch"
              class="mr-2"
              />
            <div class="text-body-2">
              {{ rocket.first_flight != '' ? formatDate(rocket.first_flight) : '-'}}
            </div>
          </v-col>

          <v-col 
            cols="12" 
            md="4"
            class="d-flex"
          >
            <v-icon
              size="small"
              icon="mdi-cash"
              class="mr-2"
              />
            <div class="text-body-2">
              {{ formatCurrency(rocket.cost_per_launch) }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="flex-grow-1 pt-0">
        <div class="text-body-2 text-justify text-clamp">
          {{ rocket.description || '-' }}
        </div>
      </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
   import type { Rocket } from '@/types/rocket';
   import { useRouter } from 'vue-router';
   import { formatDate, formatCurrency } from '@/utils/formatter';
   
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
.text-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  line-height: 1.2;      /* opsional, tapi disarankan */
  max-height: 3.6em;
}
</style>