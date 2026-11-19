<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card h-100 d-flex flex-column"
    hover
  >
    <div class="rocket-card__media">
      <v-img
        v-if="rocket.imageUrl"
        :alt="rocket.fullName"
        :aspect-ratio="1.6"
        :src="rocket.imageUrl"
        cover
      >
        <template #error>
          <div class="rocket-card__fallback">
            <v-icon color="primary" size="40"> mdi-rocket-outline </v-icon>
            <span class="text-caption mt-2">Image unavailable</span>
          </div>
        </template>
      </v-img>
      <div v-else class="rocket-card__fallback">
        <v-icon color="primary" size="40"> mdi-rocket-outline </v-icon>
        <span class="text-caption mt-2">No image</span>
      </div>
    </div>

    <div class="rocket-card__body flex-grow-1 d-flex flex-column">
      <div class="d-flex align-center ga-2 mb-2">
        <h2 class="text-subtitle-1 font-weight-bold text-truncate mb-0">
          {{ rocket.fullName }}
        </h2>
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          Local
        </v-chip>
      </div>

      <p class="rocket-card__description text-body-2 text-medium-emphasis mb-0">
        {{ description }}
      </p>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Rocket } from "@/types";
import { displayDescription } from "@/utils";

const props = defineProps<{
  rocket: Rocket;
}>();

const description = computed(() =>
  displayDescription(props.rocket.description),
);
</script>

<style scoped>
.rocket-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-2px);
}

.rocket-card__media {
  aspect-ratio: 16 / 10;
  background: linear-gradient(
    160deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-surface-variant), 0.9)
  );
  overflow: hidden;
}

.rocket-card__fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.rocket-card__body {
  padding: 1rem 1.1rem 1.35rem;
}

.rocket-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  line-height: 1.55;
}
</style>
