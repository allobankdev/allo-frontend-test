<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <v-img
      v-if="rocket.imageUrl"
      :alt="rocket.name"
      cover
      height="180"
      :src="rocket.imageUrl"
    >
      <template #error>
        <div class="rocket-image-placeholder d-flex align-center justify-center">
          <v-icon
            color="grey"
            icon="mdi-rocket-launch"
            size="48"
          />
        </div>
      </template>
    </v-img>
    <div
      v-else
      class="rocket-image-placeholder d-flex align-center justify-center"
    >
      <v-icon
        color="grey"
        icon="mdi-rocket-launch"
        size="48"
      />
    </div>

    <v-card-title class="d-flex align-center justify-space-between ga-2 text-wrap">
      <span>{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        color="primary"
        size="small"
        variant="tonal"
      >
        Local
      </v-chip>
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <p class="rocket-description text-body-2 text-medium-emphasis mb-0">
        {{ formatText(rocket.description, 'No description available.') }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'
import { formatText } from '@/utils/format'

defineProps<{
  rocket: Rocket
}>()
</script>

<style scoped>
.rocket-image-placeholder {
  height: 180px;
  background-color: rgba(128, 128, 128, 0.12);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
