<script setup lang="ts">
  import RocketImageFallback from '@/components/RocketImageFallback.vue'

  withDefaults(defineProps<{ src: string | null, height?: number | string, iconSize?: number }>(), {
    height: 190,
    iconSize: 56,
  })
</script>

<template>
  <v-img
    :src="src || undefined"
    :height="height"
    cover
  >
    <template
      v-if="!src"
      #default
    >
      <RocketImageFallback :size="iconSize" />
    </template>
    <template #placeholder>
      <RocketImageFallback :size="iconSize" />
    </template>
    <template #error>
      <RocketImageFallback :size="iconSize" />
    </template>
  </v-img>
</template>
