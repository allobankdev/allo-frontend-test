<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    rounded="lg"
    border
  >
    <!-- Rocket Image with Fallback handling -->
    <div class="rocket-img-container">
      <v-img
        :src="currentImage"
        :alt="`Image of ${rocket.fullName}`"
        cover
        height="220"
        class="bg-grey-darken-3"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
              size="24"
            />
          </div>
        </template>

        <!-- Top Badges Overlay -->
        <div class="pa-3 d-flex justify-space-between align-start">
          <v-chip
            v-if="rocket.isCustom"
            color="secondary"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            Custom
          </v-chip>
          <span v-else />

          <v-chip
            :color="rocket.active ? 'success' : 'default'"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            {{ rocket.active ? 'Active' : 'Retired' }}
          </v-chip>
        </div>
      </v-img>
    </div>

    <!-- Content -->
    <v-card-item class="pb-1">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-caption text-medium-emphasis font-weight-medium">
          {{ rocket.family || 'SpaceX' }} · {{ rocket.countryCode || 'USA' }}
        </span>
        <v-chip
          v-if="rocket.reusable"
          size="x-small"
          color="info"
          variant="tonal"
        >
          Reusable
        </v-chip>
      </div>

      <v-card-title class="text-h6 font-weight-bold text-truncate px-0">
        {{ rocket.fullName }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis">
      {{ truncatedDescription }}
    </v-card-text>

    <v-divider />

    <!-- Actions -->
    <v-card-actions class="pa-3">
      <v-btn
        :to="`/rockets/${rocket.id}`"
        color="primary"
        variant="tonal"
        block
        prepend-icon="mdi-information-outline"
        class="text-none font-weight-bold"
      >
        View Rocket Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'
import { DEFAULT_ROCKET_IMAGE } from '@/utils/constants'
import { truncateText } from '@/utils/formatters'

interface Props {
  rocket: Rocket
}

const props = defineProps<Props>()

const imgFailed = ref(false)

// Reset image error state if prop changes
watch(() => props.rocket.imageUrl, () => {
  imgFailed.value = false
})

const currentImage = computed(() => {
  if (imgFailed.value || !props.rocket.imageUrl) {
    return DEFAULT_ROCKET_IMAGE
  }
  return props.rocket.imageUrl
})

const truncatedDescription = computed(() => {
  return truncateText(props.rocket.description, 130)
})

function onImageError () {
  imgFailed.value = true
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-img-container {
  overflow: hidden;
  position: relative;
}
</style>
