<template>
  <div class="relative overflow-hidden bg-space-850">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="h-full w-full object-cover transition duration-500"
      :class="imageClass"
      @error="failed = true"
    >
    <div
      v-else
      class="flex h-full w-full flex-col items-center justify-center gap-3 text-space-600"
      role="img"
      :aria-label="`${alt} (no image available)`"
    >
      <svg
        class="h-14 w-14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2c2.6 2.2 4 5.3 4 9v5l-2 2h-4l-2-2v-5c0-3.7 1.4-6.8 4-9Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linejoin="round"
        />
        <path
          d="M8 13l-3 3v3l3-1M16 13l3 3v3l-3-1"
          stroke="currentColor"
          stroke-width="1"
          stroke-linejoin="round"
        />
      </svg>
      <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">No imagery on file</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src: string | null
    alt: string
    /** Extra classes for the <img> (e.g. hover zoom from a parent `group`). */
    imageClass?: string
  }>(), {
    imageClass: '',
  })

  /** Falls back to the placeholder when the image URL is broken. */
  const failed = ref(false)

  watch(() => props.src, () => {
    failed.value = false
  })
</script>
