<template>
  <v-card :to="`/rockets/${rocket.id}`">
    <v-img
      :src="rocket.imageUrl ?? undefined"
      height="160"
      cover
    >
      <template v-if="!rocket.imageUrl" #placeholder>
        <div class="d-flex align-center justify-center fill-height text-medium-emphasis">
          No image
        </div>
      </template>
    </v-img>

    <v-card-title>
      {{ rocket.fullName }}
      <v-chip v-if="rocket.isLocal" size="x-small" color="primary" class="ml-2">
        added by you
      </v-chip>
    </v-card-title>

    <v-card-text class="text-truncate">
      {{ rocket.description ?? 'No description available.' }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>