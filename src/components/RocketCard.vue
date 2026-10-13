<template>
  <v-card
    class="rocket-card h-100 w-100"
    border="sm"
    rounded="lg"
    elevation="0"
    hover
    @click="$emit('select', rocket)"
  >
    <v-card-item class="pa-0">
      <v-img
        :src="rocket.imageUrl ?? undefined"
        :alt="rocket.name"
        height="190"
        cover
        class="rocket-card__image"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon
              size="42"
              color="primary"
            >
              mdi-rocket-launch-outline
            </v-icon>
          </div>
        </template>

        <template #error>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon
              size="42"
              color="primary"
            >
              mdi-rocket-launch-outline
            </v-icon>
          </div>
        </template>

        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="x-small"
          variant="flat"
          class="rocket-card__badge"
        >
          Added locally
        </v-chip>
      </v-img>
    </v-card-item>

    <v-card-text class="pa-4">
      <div
        class="text-uppercase text-caption font-weight-bold mb-2 rocket-card__eyebrow"
      >
        Launcher {{ String(rocket.id).slice(0, 8) }}
      </div>

      <div class="text-h6 font-weight-bold text-white mb-2">
        {{ rocket.name }}
      </div>

      <div
        class="text-body-2 text-blue-grey-lighten-2 rocket-card__description"
      >
        {{ rocket.description || "No description available for this rocket." }}
      </div>

      <div class="d-flex align-center ga-1 text-body-2 font-weight-bold mt-4">
        View details

        <v-icon size="16">
          mdi-arrow-right
        </v-icon>
      </div>
    </v-card-text>
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
