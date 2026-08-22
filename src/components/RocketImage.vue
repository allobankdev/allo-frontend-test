<template>
  <v-img
    v-if="src && !imageFailed"
    :alt="alt"
    class="rocket-image"
    cover
    :height="height"
    :src="src"
    @error="imageFailed = true"
  >
    <template #placeholder>
      <div class="d-flex fill-height align-center justify-center">
        <v-progress-circular
          aria-label="Loading image"
          indeterminate
        />
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="rocket-image rocket-image--fallback d-flex flex-column align-center justify-center text-medium-emphasis"
    :style="{ height: `${height}px` }"
  >
    <v-icon
      class="mb-2"
      icon="mdi-image-off-outline"
      size="40"
    />
    <span class="text-body-2">Image unavailable</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src: string | null
    alt: string
    height?: number
  }>(), {
    height: 220,
  })

  const imageFailed = ref(false)

  watch(() => props.src, () => {
    imageFailed.value = false
  })
</script>

<style scoped>
  .rocket-image {
    width: 100%;
    background: rgb(var(--v-theme-surface-variant));
  }
</style>
