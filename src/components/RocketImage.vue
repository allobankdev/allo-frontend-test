<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ src: string | null, alt: string, height?: number | string }>(), { height: 240 })
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <v-img
    v-if="src && !failed"
    :src="src"
    :alt="alt"
    :height="height"
    cover
    @error="failed = true"
  />
  <div
    v-else
    class="rocket-image-fallback d-flex flex-column align-center justify-center"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    role="img"
    :aria-label="`${alt} image unavailable`"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="64"
    />
    <span class="mt-3 text-caption">Image unavailable</span>
  </div>
</template>

<style scoped>
.rocket-image-fallback { min-height: 220px; background: #e7ebee; color: #637078; }
</style>
