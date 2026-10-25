<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="u-border"
    rounded="lg"
  >
    <v-img
      :src="rocket.imageUrl ?? undefined"
      :alt="rocket.fullName"
      :aspect-ratio="4 / 3"
      cover
    >
      <template
        v-if="!rocket.imageUrl"
        #placeholder
      >
        <div class="d-flex align-center justify-center fill-height text-caption text-on-surface-variant bg-surface-variant">
          No image
        </div>
      </template>
      <template #error>
        <div class="d-flex align-center justify-center fill-height text-caption text-on-surface-variant bg-surface-variant">
          No image
        </div>
      </template>
    </v-img>

    <v-card-text>
      <div class="d-flex align-center justify-space-between ga-2 mb-2">
        <h3 class="text-subtitle-1 font-weight-bold">
          {{ rocket.fullName }}
        </h3>
        <div class="d-flex ga-1">
          <span
            v-if="rocket.isLocal"
            class="u-badge text-caption font-weight-medium text-primary"
          >
            Added
          </span>
          <span
            v-if="rocket.reusable"
            class="u-badge text-caption font-weight-medium text-primary"
          >
            Reusable
          </span>
        </div>
      </div>

      <p class="text-body-2 text-on-surface-variant u-clamp-2">
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>