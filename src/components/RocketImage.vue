<template>
  <v-img
    :alt="alt"
    class="rocket-image"
    cover
    :height="height"
    :max-height="height"
    :min-height="height"
    :src="src ?? undefined"
  >
    <!-- The API omits `image_url` for some rockets, and a URL a user typed
         may not resolve, so both cases fall back to the same placeholder. -->
    <template #error>
      <div class="rocket-image__fallback">
        <v-icon
          icon="mdi-rocket-outline"
          :size="iconSize"
        />
      </div>
    </template>
    <template #placeholder>
      <div class="rocket-image__fallback">
        <v-progress-circular
          v-if="src"
          color="primary"
          indeterminate
          size="28"
        />
        <v-icon
          v-else
          icon="mdi-rocket-outline"
          :size="iconSize"
        />
      </div>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    src: string | null
    alt: string
    height?: number | string
    iconSize?: number
  }>(), {
    height: 200,
    iconSize: 48,
  })
</script>

<style scoped>
  .rocket-image {
    background-color: rgb(var(--v-theme-surface-light));
  }

  .rocket-image__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: rgb(var(--v-theme-on-surface));
    opacity: 0.35;
  }
</style>
