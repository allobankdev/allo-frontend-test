<script setup lang="ts">
import type { Rocket } from "@/api/getRockets/types";
import { computed } from "vue";

const { rocket } = defineProps<{
  rocket: Rocket;
}>();

const shortDescription = computed(() => {
  const desc = rocket.description;
  return desc.length > 100 ? desc.slice(0, 100) + "..." : desc;
});
</script>

<template>
    <router-link
      :to="{ name: '/rocket/[id]', params: { id: rocket.id } }"
      class="text-decoration-none"
    >
    <v-card class="mx-auto">
      <v-card-item>
        <v-img cover height="200" :src="rocket.flickr_images[0]" class="mb-2" />
        <v-card-title>{{ rocket.name }}</v-card-title>
      </v-card-item>
      <v-card-text>
        {{ shortDescription }}
      </v-card-text>
    </v-card>
  </router-link>
</template>
