<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
  >
        <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        height="220"
        cover
        :alt="rocket.full_name || 'Rocket image'"
        >
        <template #error>
            <div class="rocket-image-placeholder">
            <v-icon
                icon="mdi-rocket"
                size="64"
            />

            <span class="text-medium-emphasis">
                Image unavailable
            </span>
            </div>
        </template>
        </v-img>

    <div
      v-else
      class="rocket-image-placeholder d-flex flex-column align-center justify-center"
    >
      <v-icon
        icon="mdi-rocket"
        size="64"
        class="mb-2"
      />

      <span class="text-medium-emphasis">
        No image available
      </span>
    </div>

    <v-card-item class="flex-grow-1">
      <v-card-title class="px-0">
        {{ rocket.full_name || 'Unknown Rocket' }}
      </v-card-title>

      <v-card-text class="px-0">
        {{ rocket.description || 'No description available.' }}
      </v-card-text>
    </v-card-item>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        :to="`/rockets/${rocket.id}`"
        variant="text"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'

defineProps<{
  rocket: Rocket
}>()
</script>

<style scoped>
.rocket-image-placeholder {
  height: 220px;
  background: rgba(255, 255, 255, 0.04);
}
</style>