<template>
  <v-card
    class="rocket-card"
    :to="`/rockets/${rocket.id}`"
    hover
    rounded="lg"
  >
    <v-img
      :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
      :alt="rocket.name"
      height="200"
      cover
      class="rocket-image"
    >
      <template #placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6 font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="text-body-2 rocket-description">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-actions>
      <v-chip
        :color="rocket.active ? 'success' : 'grey'"
        size="small"
        variant="tonal"
      >
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        size="small"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/stores/rockets'

const props = defineProps<{
  rocket: Rocket
}>()

const truncatedDescription = computed(() => {
  const maxLength = 120
  if (props.rocket.description.length <= maxLength) {
    return props.rocket.description
  }
  return props.rocket.description.substring(0, maxLength) + '...'
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-description {
  flex-grow: 1;
  min-height: 60px;
}

.rocket-image {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
