<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{ rocket: Rocket }>();
</script>

<template>
  <v-card
    class="launch-card cursor-pointer"
    border="primary thin"
    rounded="xl"
    elevation="0"
  >
    <div class="image-wrapper">
      <v-img
        :src="rocket.flickr_images[0]"
        :alt="rocket.name"
        cover
        height="180"
        class="patch-image"
      />

      <div class="status-badge position-absolute">
        <v-chip
          size="x-small"
          label
          class="text-uppercase font-weight-bold"
          color="primary"
          variant="flat"
        >
          {{ rocket.country }}
        </v-chip>
      </div>

      <div class="glow-overlay position-absolute" />
    </div>

    <v-card-text class="pa-5">
      <div class="d-flex flex-column justify-space-between align-start mb-2">
        <h3 class="title text-truncate">
          {{ rocket.name }}
        </h3>
        <span class="flight-number">{{ rocket.company }} </span>
      </div>

      <p class="description">
        {{
          rocket.description ||
          "No mission description provided for this flight."
        }}
      </p>

      <div class="date">
        <v-icon size="14" class="mr-2" icon="mdi-calendar" />
        {{ rocket.first_flight }}
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.launch-card {
  background: rgba(31, 41, 55, 0.4);
  transition: all 0.3s ease;
}

.launch-card:hover {
  transform: scale(1.02);
  background: rgba(31, 41, 55, 0.6);
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.2);
}

.patch-image {
  z-index: 2;
  transition: transform 0.5s ease;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
}

.launch-card:hover .patch-image {
  transform: scale(1.1);
}

/* Status badge */
.status-badge {
  top: 12px;
  right: 12px;
  z-index: 3;
}

/* Glow */
.glow-overlay {
  inset: 0;
  background: linear-gradient(
    to top right,
    rgba(30, 58, 138, 0.15),
    transparent
  );
  opacity: 0.6;
}

/* Content */
.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  padding-right: 8px;
}

.flight-number {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
}

.description {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 16px;
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
