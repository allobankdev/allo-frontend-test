<template>
  <div class="relative overflow-hidden bg-canvas">
    <img
      v-if="src && !failed"
      :alt="alt"
      class="size-full object-cover transition-opacity duration-300"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      loading="lazy"
      :src="src"
      @error="failed = true"
      @load="loaded = true"
    >

    <div
      v-if="src && !failed && !loaded"
      class="absolute inset-0 animate-pulse bg-brand-50"
    />

    <div
      v-if="!src || failed"
      class="hatch absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted"
    >
      <span class="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium">
        <i class="mdi mdi-image-off-outline text-base" />
        No image
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src?: string | null
    alt?: string
  }>(), {
    src: null,
    alt: '',
  })

  const failed = ref(false)
  const loaded = ref(false)

  watch(() => props.src, () => {
    failed.value = false
    loaded.value = false
  })
</script>
