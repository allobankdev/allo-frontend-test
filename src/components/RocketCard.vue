<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rocket: Rocket;
}>();
</script>

<template>
  <v-card height="100%" :to="`/rockets/${rocket.id}`">
    <v-img :src="rocket.image_url || undefined" height="200" cover />

    <v-card-title>
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      {{ rocket.description || "No description available." }}
    </v-card-text>
  </v-card>
</template>
