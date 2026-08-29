<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types'

const props = defineProps<{
  rocket: Rocket
}>()

const emit = defineEmits<{
  click: [id: string]
}>()

const rocketImage = computed(() => {
  return props.rocket.flickr_images?.[0] || null
})

function handleClick(id: string) {
  emit('click', id)
}
</script>

<template>
  <v-card class="rocket-card" hover @click="handleClick(rocket.id)">
    <v-img v-if="rocketImage" :src="rocketImage" :alt="rocket.name" height="200" cover class="rocket-card__image">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>
    <div v-else class="rocket-card__no-image">
      <v-icon icon="mdi-image-off" size="48" color="grey" />
      <span class="text-caption text-grey mt-2">No Image Available</span>
    </div>

    <v-card-title class="rocket-card__title">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="rocket-card__description">
      {{ rocket.description }}
    </v-card-text>

    <v-card-actions>
      <v-chip :color="rocket.active ? 'success' : 'error'" size="small" variant="tonal">
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
      <v-spacer />
      <v-btn color="primary" variant="text" @click.stop="handleClick(rocket.id)">
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-card__no-image {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(128, 128, 128, 0.1);
}

.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
