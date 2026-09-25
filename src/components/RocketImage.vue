<template>
  <v-img
    v-if="src"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    class="bg-surface-light"
    cover
    :src="src"
  >
    <template #placeholder>
      <v-skeleton-loader
        class="fill-height"
        type="image"
      />
    </template>
    <template #error>
      <RocketImagePlaceholder text="Image failed to load" />
    </template>
  </v-img>

  <v-responsive
    v-else
    :aspect-ratio="aspectRatio"
    class="bg-surface-light"
  >
    <RocketImagePlaceholder text="No image available" />
  </v-responsive>
</template>

<script lang="ts" setup>
  import RocketImagePlaceholder from './RocketImagePlaceholder.vue'

  withDefaults(defineProps<{
    src: string | null
    alt: string
    aspectRatio?: number
  }>(), {
    aspectRatio: 16 / 9,
  })
</script>
