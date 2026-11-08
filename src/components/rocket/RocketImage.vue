<script setup lang="ts">
/**
 * Rocket photo with a graceful placeholder when the URL is missing or fails to load.
 */
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string | null
  alt: string
  aspectRatio?: number
  /** Load immediately (hero images) instead of when scrolled into view. */
  eager?: boolean
}>(), {
  aspectRatio: 16 / 9,
  eager: false,
})

const hasFailed = ref(false)
watch(() => props.src, () => { hasFailed.value = false })
</script>

<template>
  <v-img
    v-if="src && !hasFailed"
    :src="src"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    :eager="eager"
    class="rocket-image"
    cover
    @error="hasFailed = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="primary"
          indeterminate
          size="28"
          width="3"
        />
      </div>
    </template>
  </v-img>

  <v-responsive
    v-else
    :aspect-ratio="aspectRatio"
    class="rocket-image rocket-image--placeholder"
  >
    <div
      class="d-flex flex-column align-center justify-center fill-height text-medium-emphasis"
      role="img"
      :aria-label="`${alt} (no image available)`"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
      />
      <span class="text-caption mt-2">No image available</span>
    </div>
  </v-responsive>
</template>

<style scoped>
.rocket-image {
  background-color: rgb(var(--v-theme-surface-bright));
}

.rocket-image--placeholder {
  background:
    radial-gradient(circle at 20% 20%, rgba(108, 155, 255, 0.18), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(182, 156, 255, 0.16), transparent 55%),
    rgb(var(--v-theme-surface-bright));
}
</style>
