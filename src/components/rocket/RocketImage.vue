<template>
  <v-img
    v-if="src && !failed"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    class="image-surface"
    :cover="cover"
    :src="src"
    @error="failed = true"
  >
    <template #placeholder>
      <div class="fill-center">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
        />
      </div>
    </template>
  </v-img>

  <v-responsive
    v-else
    :aspect-ratio="aspectRatio"
    class="image-surface"
  >
    <div
      :aria-label="`No image available for ${alt}`"
      class="fill-center"
      role="img"
    >
      <v-icon
        color="medium-emphasis"
        icon="mdi-rocket-launch-outline"
        size="48"
      />
      <span class="text-caption text-medium-emphasis mt-2">No image available</span>
    </div>
  </v-responsive>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src: string | null
    alt: string
    aspectRatio?: number | string
    cover?: boolean
  }>(), {
    aspectRatio: 16 / 9,
    cover: true,
  })

  /** Also covers URLs that exist but fail to load (404, bad host, user typo). */
  const failed = ref(false)

  watch(() => props.src, () => {
    failed.value = false
  })
</script>

<style scoped>
  /* Subtle tint that works in both light and dark themes. */
  .image-surface {
    background-color: rgba(var(--v-theme-on-surface), 0.06);
  }

  .fill-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
