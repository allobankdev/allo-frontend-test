<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ src: string | null; name: string }>()
const failed = ref(false)
const safeSource = computed(() => {
  if (!props.src) return null
  try {
    const url = new URL(props.src)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
})
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <div class="rocket-image">
    <img
      v-if="safeSource && !failed"
      :src="safeSource"
      :alt="`Roket ${name}`"
      loading="lazy"
      @error="failed = true"
    >
    <div v-else class="image-fallback" role="img" :aria-label="`Gambar ${name} belum tersedia`">
      <span aria-hidden="true">↗</span>
      <span>Gambar belum tersedia</span>
    </div>
  </div>
</template>
