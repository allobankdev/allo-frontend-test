<template>
  <v-img
    v-if="src"
    :src="src"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    cover
    class="bg-surface-variant"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular indeterminate color="primary" size="24" />
      </div>
    </template>
    <template #error>
      <div class="d-flex align-center justify-center fill-height">
        <v-icon icon="mdi-rocket-outline" size="40" class="opacity-40" />
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="d-flex align-center justify-center bg-surface-variant"
    :style="{ aspectRatio: String(aspectRatio) }"
  >
    <v-icon icon="mdi-rocket-outline" size="40" class="opacity-40" />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ src: string | null; alt: string; aspectRatio?: number }>(), {
  aspectRatio: 16 / 10,
})
</script>
