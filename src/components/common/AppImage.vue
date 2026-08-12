<template>
  <v-img
    v-if="src"
    :src="src"
    :alt="alt"
    cover
    class="bg-surface"
    :aspect-ratio="height ? undefined : 16 / 9"
    :height="height"
  >
    <template #error>
      <div
        class="app-image-placeholder"
        :style="{ height: height + 'px' }"
      >
        <v-icon
          size="56"
          color="primary"
        >
          mdi-rocket-launch-outline
        </v-icon>
      </div>
    </template>
  </v-img>
  <div
    v-else
    class="app-image-placeholder"
    :style="{ height: height + 'px' }"
  >
    <v-icon
      size="56"
      color="primary"
    >
      mdi-rocket-launch-outline
    </v-icon>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ src: string | null; alt: string; height?: number }>(),
  { height: 200 },
)
</script>

<style scoped>
.app-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: linear-gradient(
    160deg,
    rgba(var(--v-theme-primary), 0.25) 0%,
    rgb(var(--v-theme-surface)) 65%
  );
}
</style>
