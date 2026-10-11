<template>
  <v-card
    class="h-100 d-flex flex-column rocket-card"
    hover
    rounded="lg"
    variant="outlined"
    @click="$emit('select', rocket.id)"
  >
    <div
      v-if="!rocket.image_url"
      class="d-flex align-center justify-center bg-surface-variant rocket-card__media"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
      />
    </div>
    <v-img
      v-else
      :alt="displayText(rocket.full_name)"
      aspect-ratio="16/9"
      class="bg-surface-variant"
      cover
      :src="rocket.image_url"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-surface-variant">
          <v-progress-circular indeterminate />
        </div>
      </template>
      <template #error>
        <div class="d-flex align-center justify-center fill-height bg-surface-variant">
          <v-icon
            icon="mdi-image-off-outline"
            size="48"
          />
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-wrap">
        {{ displayText(rocket.full_name) }}
      </v-card-title>
      <v-card-subtitle v-if="rocket.isLocal">
        Added locally
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2 rocket-card__description">
        {{ displayText(rocket.description) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'
  import { displayText } from '@/utils/format'

  defineProps<{
    rocket: Rocket
  }>()

  defineEmits<{
    select: [id: number]
  }>()
</script>

<style scoped>
  .rocket-card {
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .rocket-card__media {
    aspect-ratio: 16 / 9;
  }

  .rocket-card__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
</style>
