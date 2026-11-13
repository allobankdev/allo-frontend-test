<script setup lang="ts">
import type { RocketResults } from '@/types/rocket';
import { ref } from 'vue';

interface Props {
  rockets: RocketResults[]
}

defineProps<Props>()

const hoveredRocket = ref<number | null>(null);


</script>

<template>
  <v-row>
    <v-col 
      v-for="rocket in rockets" 
      :key="rocket.id" 
      cols="12" 
      sm="6" 
      md="4"
    >
      <v-card
        class="h-100 cursor-pointer"
        variant="outlined"
        hover
        :to="`/rockets/${rocket.id}`"
        @mouseenter="hoveredRocket = rocket.id"
        @mouseleave="hoveredRocket = null"
      >
        <v-img 
          :src="rocket.image_url || undefined" 
          height="220" 
          cover
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon
                icon="mdi-rocket-launch-outline"
                size="64"
                color="medium-emphasis"
              />
            </div>
          </template>
          <div
            v-if="hoveredRocket === rocket.id"
            class="position-absolute fill-height w-100 bg-black d-flex align-center justify-center"
            style="opacity: 0.6"
          >
            <span class="text-white font-weight-bold">See Detail</span>
          </div>
        </v-img>

        <v-card-item>
          <v-card-title>
            {{ rocket.full_name || "Unnamed rocket" }}
          </v-card-title>
        </v-card-item>

        <v-card-text class="text-justify">
          {{ rocket.description || "No description available." }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


