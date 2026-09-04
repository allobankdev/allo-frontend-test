<template>
  <v-card
    class="rocket-card d-flex flex-column h-100 rounded-lg elevation-2"
    hover
    @click="$emit('click')"
  >
    <div class="image-wrapper">
      <v-img
        :src="currentImageSrc"
        height="220"
        cover
        class="rocket-image"
        @error="handleImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
            <v-progress-circular indeterminate color="primary" size="28" />
          </div>
        </template>
      </v-img>

      <v-chip
        v-if="rocket.isCustom"
        color="secondary"
        size="x-small"
        variant="flat"
        class="custom-badge"
      >
        Custom
      </v-chip>
    </div>

    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold rocket-title text-truncate">
        {{ rocket.name }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1 pb-3 text-body-2 text-medium-emphasis description-clamp">
      {{ rocket.description }}
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-2 justify-space-between">
      <span class="text-caption text-medium-emphasis">Click for details</span>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        append-icon="mdi-arrow-right"
      >
        View
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'
import placeholderSvg from '@/assets/rocket-placeholder.svg'

const props = defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  (e: 'click'): void
}>()

const currentImageSrc = ref(props.rocket.imageUrl || placeholderSvg)

watch(
  () => props.rocket.imageUrl,
  (newUrl) => {
    currentImageSrc.value = newUrl || placeholderSvg
  }
)

function handleImageError(): void {
  currentImageSrc.value = placeholderSvg
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  background-color: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.image-wrapper {
  position: relative;
  background-color: #121218;
}

.custom-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 4.5em;
}
</style>
