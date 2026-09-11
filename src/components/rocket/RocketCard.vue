<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card d-flex flex-column"
    variant="outlined"
    rounded="lg"
  >
    <div class="rocket-card__image">
      <v-img
        v-if="rocket.image_url && !imageError"
        :src="rocket.image_url"
        :alt="rocket.full_name"
        height="240"
        cover
        @error="imageError = true"
      />

      <div v-else class="image-placeholder">
        <v-icon icon="mdi-rocket-launch" size="64" />
      </div>
    </div>

    <v-card-item>
      <div class="d-flex align-center justify-space-between ga-4">
        <v-card-title class="pa-0 text-h6 font-weight-bold">
          {{ rocket.full_name }}
        </v-card-title>

        <v-icon icon="mdi-arrow-top-right" size="20" color="primary" />
      </div>
    </v-card-item>

    <v-card-text class="pt-0 text-medium-emphasis">
      <p class="description">
        {{ safeDescription }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  rocket: Rocket;
}>();

const imageError = ref(false);

const safeDescription = computed(() => {
  const description = props.rocket.description?.trim();

  return description || "Description unavailable.";
});

watch(
  () => props.rocket.image_url,
  () => {
    imageError.value = false;
  },
);
</script>

<style scoped>
.rocket-card {
  height: 100%;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.rocket-card__image {
  overflow: hidden;
}

.image-placeholder {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.description {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
