<template>
  <v-card
    class="rocket-card h-100"
    rounded="lg"
    hover
    @click="goToDetail"
  >
    <div class="rocket-image-wrapper">
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        :alt="rocket.full_name || 'Rocket'"
        height="220"
        cover
      />

      <div
        v-else
        class="rocket-image-placeholder"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="64"
        />

        <span class="mt-2">
          Image unavailable
        </span>
      </div>
    </div>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold px-0">
        {{ rocket.full_name || 'Unnamed Rocket' }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="px-4 pb-4">
      <p class="description">
        {{ rocket.description || 'No description available.' }}
      </p>

      <v-btn
        class="mt-4"
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        @click.stop="goToDetail"
      >
        View Details
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function goToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-image-wrapper {
  background: rgb(var(--v-theme-surface-variant));
}

.rocket-image-placeholder {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>