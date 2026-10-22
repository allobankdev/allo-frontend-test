<script setup>
import { computed } from 'vue'
import RocketImage from './RocketImage.vue'
import { withFallback } from '@/utils/formatters'

const props = defineProps({
  rocket: { type: Object, required: true },
})

defineEmits(['click'])

const description = computed(() => withFallback(props.rocket.description, 'No description available.'))
</script>

<template>
  <v-card class="h-100 d-flex flex-column" elevation="2" @click="$emit('click', rocket)">
    <RocketImage :src="rocket.imageUrl" :alt="rocket.name || 'Rocket'" height="180" />

    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.name || 'Unnamed rocket' }}
        <v-chip v-if="rocket.source === 'custom'" size="x-small" color="accent" class="ml-2">
          Added by you
        </v-chip>
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <p class="text-truncate-3">{{ rocket.description }}</p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
