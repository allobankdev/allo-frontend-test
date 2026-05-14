<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    @click="$emit('click', rocket.id)"
  >
    <v-img
      :src="imageUrl"
      height="200"
      cover
    >
      <template #placeholder>
        <v-row class="fill-height" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-2" />
        </v-row>
      </template>
      <template #error>
        <v-row
          class="fill-height bg-grey-lighten-3"
          align="center"
          justify="center"
        >
          <v-icon icon="mdi-rocket-launch" size="64" color="grey" />
        </v-row>
      </template>
    </v-img>

    <v-card-title class="d-flex align-center justify-space-between ga-2">
      <span class="text-truncate">{{ rocket.name }}</span>
      <v-chip
        :color="rocket.active ? 'success' : 'grey'"
        size="x-small"
        variant="flat"
      >
        {{ rocket.active ? "Active" : "Inactive" }}
      </v-chip>
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2 description">{{ rocket.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Rocket } from "@/stores/rocket";

const props = defineProps<{
  rocket: Rocket;
}>();

defineEmits<{
  click: [id: string];
}>();

const FALLBACK_IMAGE =
  "https://placehold.co/600x400/EEE/31343C?text=No+Image";

const imageUrl = computed(
  () => props.rocket.flickr_images?.[0] ?? FALLBACK_IMAGE,
);
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
