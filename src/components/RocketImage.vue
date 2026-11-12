<template>
  <v-img
    v-if="src && !hasError"
    :src="src"
    :alt="alt"
    :height="height"
    :rounded="rounded"
    class="rocket-image"
    cover
    @error="hasError = true"
  >
    <template #placeholder>
      <div class="rocket-image__fallback">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
    </template>
  </v-img>

  <div
    v-else
    class="rocket-image__fallback"
    :class="rounded ? `rounded-${rounded}` : undefined"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="`${alt} (image unavailable)`"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      :size="iconSize"
    />
    <span>Image unavailable</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src: string | null;
    alt: string;
    height: number;
    rounded?: string;
    iconSize?: number;
  }>(),
  {
    rounded: undefined,
    iconSize: 56,
  },
);

// Vuetify never renders its #error slot when `src` is empty, so the fallback
// is rendered here for both missing URLs and images that fail to load.
const hasError = ref(false);

watch(
  () => props.src,
  () => {
    hasError.value = false;
  },
);
</script>

<style scoped>
.rocket-image {
  background: #f1f3f5;
}

.rocket-image__fallback {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #7b8491;
  background: #f1f3f5;
  font-size: 13px;
}
</style>
