<template>
  <v-card
    class="rocket-card h-100"
    rounded="xl"
    variant="outlined"
    @click="$emit('select', rocket)"
  >
    <v-img
      :src="rocket.image_url || undefined"
      :alt="rocket.full_name"
      height="210"
      cover
    >
      <template #placeholder>
        <div class="image-fallback">
          <v-icon icon="mdi-rocket-launch" size="48" />
          <span>Image unavailable</span>
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.full_name || "Unnamed rocket" }}
      </v-card-title>

      <v-card-text class="description">
        {{ rocket.description || "No description available." }}
      </v-card-text>
    </v-card-item>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        append-icon="mdi-arrow-right"
        @click.stop="$emit('select', rocket)"
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

defineEmits<{
  select: [rocket: Rocket];
}>();
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-3px);
}

.description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.6;
}

.image-fallback {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f3f4f6;
  color: #6b7280;
}
</style>
