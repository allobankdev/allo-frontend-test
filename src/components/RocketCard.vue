<template>
  <v-card
    class="rocket-card h-100"
    rounded="xl"
    elevation="0"
    border
    :to="`/rockets/${rocket.id}`"
  >
    <div class="rocket-image-wrapper">
      <RocketImage
        :src="rocket.imageUrl"
        :alt="rocket.name"
        :height="220"
      />

      <v-chip
        v-if="rocket.isCustom"
        class="custom-chip"
        color="primary"
        size="small"
        variant="flat"
      >
        Custom
      </v-chip>
    </div>

    <v-card-text class="pa-5">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-caption text-medium-emphasis">
          {{ rocket.country || "Country unavailable" }}
        </span>

        <v-icon
          icon="mdi-arrow-top-right"
          size="small"
          color="medium-emphasis"
        />
      </div>

      <h3 class="text-h6 font-weight-bold mb-3">
        {{ rocket.name }}
      </h3>

      <p class="text-body-2 text-medium-emphasis description">
        {{ rocket.description || "No description available for this rocket." }}
      </p>
    </v-card-text>
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
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.rocket-image-wrapper {
  position: relative;
  overflow: hidden;
}

.custom-chip {
  position: absolute;
  top: 14px;
  right: 14px;
}

.description {
  display: -webkit-box;
  overflow: hidden;
  min-height: 60px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.5;
}
</style>
