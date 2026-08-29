<template>
  <v-card
    class="rocket-card"
    @click="$emit('click')"
    :to="`/rockets/${rocket.id}`"
  >
    <div v-if="rocketImage" class="rocket-card-image">
      <v-img
        :src="rocketImage"
        aspect-ratio="16/9"
        cover
        alt="Rocket image"
      />
    </div>
    <div
      v-else
      class="rocket-card-image rocket-card-image--placeholder"
    >
      <v-icon size="64" color="#1976d2">mdi-rocket</v-icon>
    </div>

    <v-card-title class="rocket-card-title">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle
      v-if="rocket.type"
      class="rocket-card-type"
    >
      {{ rocket.type }}
    </v-card-subtitle>

    <v-card-text class="rocket-card-description">
      {{ truncateDescription(rocket.description, 100) }}
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text>View Details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

interface Props {
  rocket: Rocket
}

const props = defineProps<Props>()
defineEmits(['click'])

const rocketImage = computed(() => {
  if (props.rocket.image && props.rocket.image.trim() !== '') {
    return props.rocket.image
  }

  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    return props.rocket.flickr_images[0]
  }

  return null
})

const truncateDescription = (text: string | undefined, length: number) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.rocket-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.rocket-card-image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.rocket-card-title {
  padding-top: 16px;
  word-break: break-word;
  color: #f5f5f5;
  font-weight: 600;
}

.rocket-card-type {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #1976d2;
  font-weight: 600;
}

.rocket-card-description {
  flex-grow: 1;
  color: #f5f5f5;
  line-height: 1.5;
  font-size: 14px;
}

.rocket-card-actions {
  padding-top: 0;
}
</style>
