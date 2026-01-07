<script setup lang="ts">
import type { Rocket } from "@/services/rocket.service";

defineProps<{
  rocket: Rocket;
}>();

const emit = defineEmits<{
  (e: "viewImages", images: string[]): void;
  (e: "goDetail", id: string): void;
}>();
</script>

<template>
  <v-card class="h-full flex flex-col hover:-translate-y-3! transition-transform! duration-500! pb-5 relative">
    <v-img
      :src="rocket.flickr_images[0] || '/default.png'"
      class="align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
      cover
      style="cursor: pointer"
      @click="emit('goDetail', rocket.id)"
    >
      <v-card-title class="text-white">
        {{ rocket.name }}
      </v-card-title>
    </v-img>

    <v-card-text class="text-justify">
      {{ rocket.description }}
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        size="small"
        class="mt-auto pb-64"
        @click="emit('viewImages', rocket.flickr_images)"
      >
        View Images
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
