<template>
  <v-img
    :alt="alt"
    :aspect-ratio="aspectRatio"
    class="rocket-image"
    cover
    :height="height"
    :src="resolvedSrc"
    @error="handleImageError"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height rocket-image-placeholder">
        <v-progress-circular
          color="primary"
          indeterminate
          size="28"
          width="2"
        />
      </div>
    </template>
  </v-img>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getRocketImage } from '@/utils/rocketFormatter'

interface Props {
  src?: string | null
  alt?: string
  aspectRatio?: string | number
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  src: null,
  alt: 'Rocket image',
  aspectRatio: 16 / 9,
  height: undefined,
})

const hasLoadError = ref(false)

watch(
  () => props.src,
  () => {
    hasLoadError.value = false
  },
)

const resolvedSrc = computed(() => {
  if (hasLoadError.value) {
    return getRocketImage(null)
  }

  return getRocketImage(props.src)
})

function handleImageError(): void {
  hasLoadError.value = true
}
</script>

<style scoped>
.rocket-image {
  background-color: #1e2430;
}

.rocket-image-placeholder {
  background-color: #1e2430;
}
</style>
