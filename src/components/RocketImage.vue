<template>
  <div
    class="rocket-image-wrapper d-flex align-center justify-center bg-surface-variant"
    :style="{ height: heightPx }"
  >
    <v-img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      cover
      height="100%"
      width="100%"
      @error="hasError = true"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="primary"
            indeterminate
            size="28"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="d-flex flex-column align-center justify-center text-medium-emphasis pa-4 text-center"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="40"
        class="mb-2"
      />
      <span class="text-caption">No Image Available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string | null
    alt: string
    height?: number | string
  }>(),
  {
    height: 180,
  },
)

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  },
)

const heightPx = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)
</script>

<style scoped>
.rocket-image-wrapper {
  width: 100%;
  overflow: hidden;
}
</style>
