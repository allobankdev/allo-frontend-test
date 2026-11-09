<template>
  <v-card
    class="hoverable cursor-pointer elevation-4 bg-grey-darken-4"
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images[0]"
      height="200px"
      cover
    />
    <v-card-title class="text-white font-weight-bold text-h6">
      {{ rocket.name }}
    </v-card-title>
    <v-card-text class="text-white text-body-2 text-truncate">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { IDataRocket } from "@/types/rocket";

defineProps<{ rocket: IDataRocket }>();
defineEmits(["click"]);
</script>
