<template>
  <v-img
    v-if="src && !failed"
    :alt="alt"
    :aspect-ratio="ratio"
    cover
    :src="src"
    @error="failed = true"
  />
  <div
    v-else
    :aria-label="`${alt} (no image)`"
    class="d-flex flex-column align-center justify-center bg-surface-variant text-medium-emphasis"
    role="img"
    :style="{ aspectRatio: String(ratio) }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="40"
    />
    <span class="text-caption mt-1">No image</span>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src: string | null
    alt: string
    ratio?: number
  }>(), { ratio: 16 / 10 })

  // Placeholder juga dipakai bila URL ada tapi gambar gagal dimuat.
  const failed = ref(false)
  watch(() => props.src, () => (failed.value = false))
</script>
