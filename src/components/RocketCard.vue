<template>
  <v-card
    class="rocket-card"
    elevation="2"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocketImage"
      height="250"
      cover
      class="rocket-image"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>

    <v-card-title class="rocket-name">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle class="mt-1">
      {{ rocket.country }} • {{ rocket.company }}
    </v-card-subtitle>

    <v-card-text>
      <p class="rocket-description">
        {{ truncatedDescription }}
      </p>
      <div class="d-flex gap-2 mt-2">
        <v-chip
          :color="rocket.active ? 'success' : 'default'"
          size="small"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
        <v-chip
          color="primary"
          size="small"
        >
          {{ rocket.type }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

interface Props {
  rocket: Rocket
  maxDescriptionLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDescriptionLength: 150,
})

defineEmits<{
  click: []
}>()

const rocketImage = computed(() => {
  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    return props.rocket.flickr_images[0]
  }
  return 'https://via.placeholder.com/400x250?text=No+Image'
})

const truncatedDescription = computed(() => {
  const description = props.rocket.description || 'No description available'
  if (description.length <= props.maxDescriptionLength) {
    return description
  }
  return description.substring(0, props.maxDescriptionLength) + '...'
})
</script>
