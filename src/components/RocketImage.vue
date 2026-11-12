<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  src?: string
  alt?: string
}>()

const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" loading="lazy" class="rocket-image" @error="failed = true" />
  <div v-else class="rocket-image rocket-image--empty" role="img" :aria-label="`No image for ${alt}`">No image</div>
</template>
