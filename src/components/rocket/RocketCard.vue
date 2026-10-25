<template>
  <v-card class="rocket-card h-100" :to="`/rockets/${rocket.id}`" hover>
    <v-img
      :src="rocket.image_url ?? undefined"
      :alt="rocket.full_name"
      height="220"
      cover
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon icon="mdi-rocket-outline" size="64" />
        </div>
      </template>
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon icon="mdi-image-off-outline" size="64" />
        </div>
      </template>
    </v-img>
    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.full_name }}
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <p class="rocket-description">
        {{ rocket.description || "No description available." }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :to="`/rockets/${rocket.id}`"
        variant="text"
        append-icon="mdi-arrow-right"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rocket: Rocket;
}>();
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
}

.rocket-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
