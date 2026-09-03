<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: 'Rocket' },
  height: { type: [String, Number], default: '200' },
})

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  },
)
</script>

<template>
  <v-img
    v-if="src && !hasError"
    :src="src"
    :alt="alt"
    :height="height"
    cover
    @error="hasError = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular indeterminate color="primary" size="28" />
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-3 text-medium-emphasis"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <v-icon icon="mdi-image-off-outline" size="36" />
    <span class="text-caption mt-1">No image available</span>
  </div>
</template>
