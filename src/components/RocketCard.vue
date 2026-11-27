<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
    rounded="lg"
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.full_name"
      :height="200"
      :src="rocket.image_url"
    />

    <v-card-item>
      <div class="d-flex align-center justify-space-between ga-2">
        <v-card-title class="pa-0 text-subtitle-1 font-weight-bold">
          {{ formatText(rocket.full_name, 'Unnamed Rocket') }}
        </v-card-title>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="x-small"
          variant="tonal"
        >
          New
        </v-chip>
      </div>
      <v-card-subtitle
        v-if="rocket.family"
        class="pa-0 mt-1"
      >
        {{ rocket.family }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1">
      <p class="rocket-description">
        {{ formatText(rocket.description) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import RocketImage from '@/components/RocketImage.vue'
  import type { Rocket } from '@/types/rocket'
  import { formatText } from '@/utils/format'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>