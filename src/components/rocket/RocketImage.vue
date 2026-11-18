<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    src: string | null
    alt: string
}>()

const hasFailed = ref(false)
watch(
    () => props.src,
    () => {
        hasFailed.value = false
    },
)

const showFallback = computed(() => !props.src || hasFailed.value)
</script>

<template>
  <div class="rocket-image">
    <v-img
      v-if="!showFallback && src"
      :src="src"
      :alt="alt"
      cover
      class="rocket-image__img"
      @error="hasFailed = true"
    />

    <div
      v-else
      class="rocket-image__fallback"
    >
      <v-icon
        icon="mdi-image-off-outline"
        size="36"
      />
      <span class="text-caption">No image available</span>
    </div>
  </div>
</template>

<style scoped>
.rocket-image {
    position: relative;
    aspect-ratio: 16 / 9;
    width: 100%;
    overflow: hidden;
    background: rgba(var(--v-theme-on-surface), 0.06);
}

.rocket-image__img {
    width: 100%;
    height: 100%;
}

.rocket-image__fallback {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: rgba(var(--v-theme-on-surface), 0.55);
}
</style>
