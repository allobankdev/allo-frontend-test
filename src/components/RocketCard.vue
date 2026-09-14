<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    hover
  >
    <v-img
      :src="src"
      :alt="rocket.full_name"
      cover
      height="200"
      @error="onError"
    />
    <v-card-title>{{ rocket.full_name }}</v-card-title>
    <v-card-subtitle v-if="rocket.family">
      {{ rocket.family }}
    </v-card-subtitle>
    <v-card-text class="rocket-card__description">
      {{ formatDescription(rocket.description) }}
    </v-card-text>
    <v-card-actions>
      <v-chip
        v-if="rocket.active === true"
        color="success"
        size="small"
        variant="tonal"
      >
        Active
      </v-chip>
      <v-chip
        v-else-if="rocket.active === false"
        color="grey"
        size="small"
        variant="tonal"
      >
        Inactive
      </v-chip>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        :to="`/rockets/${rocket.id}`"
      >
        Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { useRocketImage } from '@/composables/useRocketImage'
import type { Rocket } from '@/types/rocket'
import { formatDescription } from '@/utils/format'

const props = defineProps<{ rocket: Rocket }>()

const { src, onError } = useRocketImage(props.rocket.image_url, props.rocket.id)
</script>

<style scoped>
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
