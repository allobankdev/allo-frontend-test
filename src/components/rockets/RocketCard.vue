<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rocket: Rocket;
}>();
</script>

<template>
  <v-card :to="`/rockets/${rocket.id}`" class="h-100" elevation="2" hover>
    <v-img
      v-if="rocket.image_url"
      :alt="rocket.full_name || 'Rocket image'"
      :src="rocket.image_url"
      cover
      height="220"
    >
      <template #error>
        <div class="image-placeholder">
          <v-icon icon="mdi-rocket-launch" size="64" />
        </div>
      </template>
    </v-img>

    <div v-else class="image-placeholder">
      <v-icon icon="mdi-rocket-launch" size="64" />
    </div>

    <v-card-title>
      {{ rocket.full_name || "Unnamed rocket" }}
    </v-card-title>

    <v-card-subtitle v-if="rocket.manufacturer?.country_code">
      {{ rocket.manufacturer.country_code }}
    </v-card-subtitle>

    <v-card-text class="description">
      {{ rocket.description || "No description available." }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.image-placeholder {
  align-items: center;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  display: flex;
  height: 220px;
  justify-content: center;
}

.description {
  display: -webkit-box;
  min-height: 72px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
