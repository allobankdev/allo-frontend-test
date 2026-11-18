<template>
  <v-img
    v-if="src"
    :src="src"
    :alt="alt"
    :height="height"
    cover
  >
    <template #placeholder>
      <div class="d-flex fill-height align-center justify-center">
        <v-progress-circular
          indeterminate
          size="24"
        />
      </div>
    </template>
    <template #error>
      <div
        class="rocket-image-fallback"
        :style="{ height }"
      >
        <v-icon
          icon="mdi-image-broken-variant"
          size="40"
        />
        <span class="text-caption">Image failed to load</span>
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="rocket-image-fallback"
    :style="{ height }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption">Image not available</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string | null
    alt: string
    height?: string
  }>(),
  { height: '180px' },
)
</script>

<style scoped>
.rocket-image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: rgba(var(--v-theme-on-surface), 0.06);
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
