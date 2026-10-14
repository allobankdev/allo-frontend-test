<template>
  <v-img
    v-if="src && !hasLoadError"
    :alt="`${name} rocket`"
    cover
    :height="height"
    :src="src"
    @error="hasLoadError = true"
  />

  <!-- Shown when there is no image URL, or when the URL fails to load -->
  <div
    v-else
    class="fallback d-flex flex-column align-center justify-center text-medium-emphasis"
    :style="{ height: `${height}px` }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption mt-2">
      {{ src ? 'Image unavailable' : 'No image available' }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  withDefaults(defineProps<{
    src: string | null
    name: string
    height?: number
  }>(), {
    height: 200,
  })

  const hasLoadError = ref(false)
</script>

<style scoped>
.fallback {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}
</style>
