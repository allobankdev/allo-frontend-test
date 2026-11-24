<template>
  <v-img
    v-if="src"
    :src="src"
    :alt="alt"
    :height="height"
    cover
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          indeterminate
          size="28"
        />
      </div>
    </template>
    <template #error>
      <div class="d-flex align-center justify-center fill-height bg-surface-variant">
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="48"
        />
      </div>
    </template>
  </v-img>
  <div
    v-else
    class="d-flex align-center justify-center bg-surface-variant"
    :style="{ height: `${height}px` }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
  </div>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{ src: string | null; alt: string; height?: number }>(),
    { height: 200 },
  )
</script>