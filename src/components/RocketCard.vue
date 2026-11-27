<template>
  <v-card
    class="d-flex flex-column fill-height"
    hover
    rounded="lg"
    @click="$emit('select', rocket.id)"
  >
    <RocketImage
      :alt="rocket.name"
      :height="220"
      :src="rocket.imageUrl"
    />

    <v-card-item>
      <div class="d-flex align-center justify-space-between ga-2">
        <v-card-title class="text-subtitle-1 font-weight-bold pa-0">
          {{ rocket.name }}
        </v-card-title>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          label
          size="x-small"
          variant="tonal"
        >
          New
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-0">
      <p class="text-body-2 text-medium-emphasis rocket-description">
        {{ formatFallbackText(rocket.description, 'No description available.') }}
      </p>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <v-spacer />
      <v-btn
        append-icon="mdi-arrow-right"
        color="primary"
        size="small"
        variant="text"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import RocketImage from '@/components/RocketImage.vue'
  import type { Rocket } from '@/types/rocket'
  import { formatFallbackText } from '@/utils/formatters'

  interface Props {
    rocket: Rocket
  }

  defineProps<Props>()

  defineEmits<{
    select: [id: number]
  }>()
</script>

<style scoped>
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>