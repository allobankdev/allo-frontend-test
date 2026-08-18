<script setup lang='ts'>
import type { UnifiedRocket } from '@/types/rocket';

defineProps<{ rocket: UnifiedRocket }>()

const emit = defineEmits<{
  click: [rocketId?: string]
}>()

const onClick = () => {
  emit("click")
}
</script>

<template>
  <v-card
    class="fill-height d-flex flex-column"
  >
    <v-carousel
      :height="300"
      :hide-delimiters="true"
      show-arrows="hover"
      crossfade
    >
      <v-carousel-item
        v-for="image in rocket.flickr_images"
        :key="image"
        :src="image"
        cover
      />
    </v-carousel>
    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text>{{ rocket.description }}</v-card-text>
    <v-card-actions class="mt-auto justify-end">
      <v-btn
        variant="tonal"
        @click="onClick"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>