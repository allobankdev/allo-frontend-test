<template>
  <v-card
    :aria-label="rocket.full_name"
    height="100%"
    class="d-flex flex-column"
    hover
    @click="emit('click')"
  >
    <RocketImage
      :src="rocket.image_url"
      height="180"
    />

    <v-card-title class="text-wrap">
      {{ rocket.full_name }}
      <v-chip
        v-if="rocket.isLocal"
        size="x-small"
        color="primary"
        class="ml-1"
        variant="flat"
      >
        Ditambahkan
      </v-chip>
    </v-card-title>

    <v-card-text class="flex-grow-1">
      {{ truncate(formatDescription(rocket.description), 110) }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import RocketImage from './RocketImage.vue'
import type { Rocket } from '@/types/rocket'
import { formatDescription, truncate } from '@/utils/format'

defineProps<{
  rocket: Rocket
}>()

const emit = defineEmits<{
  click: []
}>()
</script>
