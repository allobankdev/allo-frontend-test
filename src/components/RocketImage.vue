<template>
  <v-img
    v-if="src && !failed"
    :alt="alt"
    class="bg-grey-lighten-3"
    :height="height"
    :src="src"
    @error="failed = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey"
          indeterminate
        />
      </div>
    </template>
  </v-img>
  <div
    v-else
    class="d-flex flex-column align-center justify-center bg-grey-lighten-3 text-grey"
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
    src: string | null
    alt: string
    height?: number | string
  }>(), { height: 200 })

  const failed = ref(false)
  watch(() => props.src, () => { failed.value = false })
</script>

