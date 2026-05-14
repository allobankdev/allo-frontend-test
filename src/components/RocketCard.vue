<template>
  <v-card hover>
    <v-img
      :src="rocket.flickr_images?.[0]"
      height="200"
      cover
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
          <v-icon
            icon="mdi-image-off"
            size="48"
            color="grey"
          />
        </div>
      </template>
      <div class="d-flex ga-1 ma-2">
        <v-chip
          :color="rocket.active ? 'success' : 'error'"
          size="small"
          label
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="small"
          label
        >
          Local
        </v-chip>
      </div>
    </v-img>

    <v-card-title class="text-truncate">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 description-clamp text-medium-emphasis">
        {{ rocket.description || 'No description available.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
