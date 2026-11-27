<template>
  <v-img
    v-if="src && !hasError"
    :alt="alt"
    cover
    :height="height"
    :src="src"
    @error="hasError = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height bg-surface-variant">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
        />
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="d-flex flex-column align-center justify-center bg-surface-variant text-medium-emphasis"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption mt-2">No image available</span>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src: string | null | undefined
    alt: string
    height?: number | string
  }>(), {
    height: 200,
  })

  const hasError = ref(false)

  watch(() => props.src, () => {
    hasError.value = false
  })
</script>