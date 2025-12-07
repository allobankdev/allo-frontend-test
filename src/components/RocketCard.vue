<template>
  <v-card
    class="h-100"
    hover
    variant="outlined"
    @click="$emit('click')"
  >
    <v-img
      v-if="rocket.flickr_images && rocket.flickr_images.length"
      :src="rocket.flickr_images[0]"
      height="180"
      cover
    />
    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text class="text-truncate">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  //
  import type { Rocket } from '@/services/spacexService'

  defineProps<{ rocket: Rocket }>()

  defineEmits<(e: 'click') => void>()
</script>
