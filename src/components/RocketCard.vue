<template>
  <v-card
    class="rocket-card d-flex flex-column"
    height="100%"
    rounded="lg"
    elevation="2"
    color="rgba(255, 255, 255, 0.08)"
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.flickr_images[0] || ''"
      height="200"
      min-height="200"
      max-height="200"
      cover
      class="rocket-card__image flex-grow-0 flex-shrink-0"
    >
      <template #placeholder>
        <v-row class="fill-height" align="center" justify="center">
          <v-progress-circular indeterminate color="white" />
        </v-row>
      </template>

      <template #error>
        <v-row class="fill-height bg-grey-darken-3" align="center" justify="center" style="min-height: 300px; max-height: 300px; padding-bottom:65px">
          <v-icon size="48" color="grey">mdi-rocket-launch-outline</v-icon>
        </v-row>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.name }}
      </v-card-title>

      <template v-if="isLocal" #append>
        <v-chip size="small" color="white" variant="outlined">Local</v-chip>
      </template>
    </v-card-item>

    <v-card-text class="text-body-2  pb-4" style="font-weight: 400;">
      <span class="rocket-card__description">
        {{ rocket.description }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket, LocalRocket } from '@/types'

const props = defineProps<{
  rocket: Rocket | LocalRocket
}>()

defineEmits<{
  click: []
}>()

const isLocal = 'isLocal' in props.rocket && props.rocket.isLocal
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: calc(1.5em * 3);
}
</style>
