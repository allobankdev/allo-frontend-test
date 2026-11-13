<template>
  <v-img
    v-if="showImage"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    cover
    :src="src ?? undefined"
    @error="failed = true"
  />
  <div
    v-else
    :aria-label="`${alt} (tidak ada gambar)`"
    class="d-flex align-center justify-center bg-surface-variant"
    role="img"
    :style="{ aspectRatio }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      src?: string | null
      alt: string
      aspectRatio?: number
    }>(),
    { src: null, aspectRatio: 16 / 9 },
  )

  // true jika URL gambar rusak / gagal dimuat
  const failed = ref(false)
  watch(() => props.src, () => {
    failed.value = false
  })

  const showImage = computed(() => Boolean(props.src) && !failed.value)
</script>