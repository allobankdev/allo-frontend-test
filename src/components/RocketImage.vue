<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ src: string | null; name: string; eager?: boolean }>()
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <div class="rocket-image">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="name"
      :loading="eager ? 'eager' : 'lazy'"
      @error="failed = true"
    >
    <div
      v-else
      class="image-placeholder"
      role="img"
      :aria-label="'Image unavailable for ' + name"
    >
      <span
        aria-hidden="true"
        class="placeholder-symbol"
      >↑</span>
      <span>Image unavailable</span>
    </div>
  </div>
</template>
