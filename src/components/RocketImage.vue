<template>
  <!-- Real image: only when a URL exists and it has not failed to load. -->
  <v-img
    v-if="src && !failed"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    cover
    :src="src"
    @error="failed = true"
  />
  <!-- Placeholder: keeps the same aspect ratio so the layout does not jump. -->
  <div
    v-else
    class="rocket-image-placeholder"
    :style="{ aspectRatio }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption mt-2">No image available</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string | null
  alt: string
  aspectRatio?: number
}>(), {
  aspectRatio: 16 / 9,
})

// Falls back to the placeholder when the URL is missing *or* fails to load.
const failed = ref(false)
// A new src deserves a fresh attempt, so clear the previous failure.
watch(() => props.src, () => { failed.value = false })
</script>

<style scoped>
.rocket-image-placeholder {
  align-items: center;
  background: rgba(var(--v-theme-on-surface), 0.06);
  color: rgba(var(--v-theme-on-surface), 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
</style>
