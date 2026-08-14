<template>
  <div
    v-if="!src"
    class="d-flex flex-column align-center justify-center bg-grey-lighten-3 rocket-image-fallback"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption mt-2 text-medium-emphasis">No image available</span>
  </div>
  <v-img
    v-else
    :alt="alt"
    aspect-ratio="16/9"
    class="bg-grey-lighten-3"
    cover
    :src="src"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey-lighten-1"
          indeterminate
        />
      </div>
    </template>
    <template #error>
      <div class="d-flex flex-column align-center justify-center fill-height text-medium-emphasis">
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="48"
        />
        <span class="text-caption mt-2">No image available</span>
      </div>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
  defineProps<{
    src: string | null | undefined
    alt: string
  }>()
</script>

<style scoped>
.rocket-image-fallback {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
