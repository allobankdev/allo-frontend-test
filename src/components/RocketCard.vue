<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    color="surface"
    rounded="xl"
    class="rocket-card d-flex flex-column h-100"
  >
    <div class="rocket-card-media">
      <RocketImage
        :src="rocket.imageUrl"
        :alt="rocket.fullName"
        :height="200"
      />
      <div class="rocket-card-scrim" aria-hidden="true" />
    </div>

    <v-card-item class="pt-4 pb-1 px-5">
      <div class="d-flex align-center justify-space-between ga-2">
        <v-card-title
          class="rocket-card-title text-subtitle-1 font-weight-bold text-truncate pa-0"
        >
          {{ rocket.fullName }}
        </v-card-title>
        <v-chip
          v-if="rocket.isCustom"
          size="x-small"
          color="primary"
          variant="tonal"
          class="flex-shrink-0"
        >
          Custom
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text
      class="text-body-2 text-medium-emphasis pt-1 pb-5 px-5 flex-grow-1"
    >
      <p class="rocket-description mb-0">
        {{ formatDescription(rocket.description) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import RocketImage from "@/components/RocketImage.vue";
import type { Rocket } from "@/types/rocket";
import { formatDescription } from "@/utils/formatters";

defineProps<{
  rocket: Rocket;
}>();
</script>

<style scoped>
.rocket-card {
  position: relative;
  border: 1px solid var(--app-border);
  overflow: hidden;
  transition:
    transform 180ms var(--app-ease-out),
    border-color 180ms var(--app-ease-out),
    box-shadow 180ms var(--app-ease-out);
}

.rocket-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(147, 197, 253, 0.08) 48%,
    rgba(255, 255, 255, 0.12) 52%,
    transparent 70%
  );
  transform: translateX(-110%);
  opacity: 0;
  transition:
    transform 420ms var(--app-ease-out),
    opacity 180ms var(--app-ease-out);
}

.rocket-card-media {
  position: relative;
  overflow: hidden;
}

.rocket-card-media :deep(.v-img__img) {
  transition: transform 240ms var(--app-ease-out);
}

.rocket-card-title {
  transition: color 180ms var(--app-ease-out);
}

.rocket-card-scrim {
  position: absolute;
  inset: auto 0 0 0;
  height: 44px;
  background: linear-gradient(to top, rgba(19, 27, 36, 0.72), transparent);
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .rocket-card:hover {
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow:
      0 12px 28px -8px rgba(0, 0, 0, 0.55),
      0 0 0 1px rgba(59, 130, 246, 0.35);
  }

  .rocket-card:hover::after {
    transform: translateX(110%);
    opacity: 1;
  }

  .rocket-card:hover .rocket-card-title {
    color: #93c5fd;
  }

  .rocket-card:hover .rocket-card-media :deep(.v-img__img) {
    transform: scale(1.03);
  }
}

.rocket-card:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .rocket-card,
  .rocket-card::after,
  .rocket-card-title,
  .rocket-card-media :deep(.v-img__img) {
    transition: none;
  }

  .rocket-card::after {
    display: none;
  }

  .rocket-card:hover,
  .rocket-card:hover .rocket-card-media :deep(.v-img__img) {
    transform: none;
  }
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.55;
}
</style>
