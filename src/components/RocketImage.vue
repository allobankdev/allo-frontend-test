<template>
  <v-img
    v-if="hasValidSource"
    :alt="alt"
    class="bg-surface-variant"
    :cover="cover"
    :height="height"
    :src="src ?? undefined"
    @error="handleImageError"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
        />
      </div>
    </template>
  </v-img>

  <v-sheet
    v-else
    class="d-flex flex-column align-center justify-center text-medium-emphasis"
    color="surface-variant"
    :height="height"
  >
    <v-icon
      class="mb-2"
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption">No image available</span>
  </v-sheet>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'

  interface Props {
    src: string | null | undefined
    alt: string
    height?: number | string
    cover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 220,
    cover: true,
  })

  const imageFailed = ref(false)

  watch(
    () => props.src,
    () => {
      imageFailed.value = false
    },
  )

  const hasValidSource = computed(() => Boolean(props.src?.trim()) && !imageFailed.value)

  function handleImageError () {
    imageFailed.value = true
  }
</script>