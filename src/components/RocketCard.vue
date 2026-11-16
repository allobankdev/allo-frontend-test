<template>
  <v-card
    class="rocket-card h-100 rounded-lg d-flex flex-column"
    elevation="2"
    hover
    :to="`/rocket/${rocket.id}`"
  >
    <div class="rocket-image-container">
      <v-img
        v-if="rocket.image_url && !imageFailed"
        :src="rocket.image_url"
        height="200"
        cover
        class="bg-grey-darken-3"
        @error="handleImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
            <v-progress-circular
              indeterminate
              color="primary"
              size="24"
            />
          </div>
        </template>
      </v-img>

      <div
        v-else
        class="d-flex flex-column align-center justify-center bg-grey-darken-3 text-medium-emphasis"
        style="height: 200px"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="48"
          class="mb-1"
        />
        <span class="text-caption">No Image Available</span>
      </div>
    </div>

    <v-card-item class="pb-1 pt-3">
      <div class="d-flex align-center justify-space-between ga-2">
        <v-card-title
          class="text-subtitle-1 font-weight-bold text-truncate pa-0"
          :title="rocketName"
        >
          {{ rocketName }}
        </v-card-title>
        <v-chip
          v-if="rocket.isCustom"
          size="x-small"
          color="info"
          variant="flat"
        >
          Custom
        </v-chip>
        <v-chip
          v-else
          size="x-small"
          :color="rocket.active ? 'success' : 'default'"
          variant="tonal"
        >
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1 pb-3">
      <p class="description-text text-body-2 text-medium-emphasis mb-0">
        {{ rocketDescription }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { RocketItem } from '@/types/rocket'

const props = defineProps<{
  rocket: RocketItem
}>()

const imageFailed = ref(false)

const handleImageError = () => {
  imageFailed.value = true
}

const rocketName = computed(() => {
  return props.rocket.full_name || props.rocket.name || 'Unnamed Rocket'
})

const rocketDescription = computed(() => {
  return props.rocket.description || 'No description available for this rocket.'
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
}

.rocket-image-container {
  overflow: hidden;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.2em;
  line-height: 1.4;
}
</style>
