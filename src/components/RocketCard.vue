<script setup lang="ts">
import type { Rocket } from "@/types/rocket";
import RocketImage from "./RocketImage.vue";

defineProps<{ rocket: Rocket }>();
</script>

<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="h-100 rocket-card"
    rounded="lg"
    hover
  >
    <div class="rocket-card__image-wrap">
      <RocketImage
        :src="rocket.imageUrl"
        :alt="rocket.name"
        :height="160"
      />
      <v-chip
        v-if="rocket.country"
        class="rocket-card__country"
        size="small"
        color="black"
        variant="flat"
      >
        {{ rocket.country }}
      </v-chip>
    </div>

    <v-card-title class="text-truncate">
      {{ rocket.name || "Unnamed rocket" }}
    </v-card-title>
    <v-card-text class="rocket-card__description">
      {{
        rocket.description || "No description available for this rocket yet."
      }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.rocket-card:hover {
  transform: translateY(-2px);
}

.rocket-card__image-wrap {
  position: relative;
}

.rocket-card__country {
  position: absolute;
  left: 8px;
  bottom: 8px;
  opacity: 0.85;
}

.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
