<template>
  <v-img
    v-if="mode === 'probe'"
    :src="first"
    :height="height"
    cover
    @load="onProbeLoad"
    @error="onProbeError"
  >
    <template #placeholder>
      <v-skeleton-loader type="image" />
    </template>
  </v-img>

  <v-img
    v-else-if="mode === 'fallback'"
    :src="fallbackSrc"
    :height="height"
    cover
  >
    <template #placeholder>
      <v-skeleton-loader type="image" />
    </template>
  </v-img>

  <v-carousel
    v-else
    :height="height"
    hide-delimiter-background
    show-arrows="hover"
    color="primary"
    cycle
  >
    <v-carousel-item v-for="src in validImages" :key="src">
      <v-img :src="src" :height="height" cover @error="onImageError(src)">
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  images?: string[];
  fallbackSrc: string;
  height?: number | string;
}>();

type Mode = "probe" | "fallback" | "carousel";

const mode = ref<Mode>("probe");
const failed = ref(new Set<string>());

const first = computed(() => props.images?.[0] || "");
const validImages = computed(() =>
  (props.images || []).filter((u) => u && !failed.value.has(u))
);

const fallbackSrc = computed(() => props.fallbackSrc);

function reset() {
  mode.value = first.value ? "probe" : "fallback";
  failed.value = new Set<string>();
}

watch(first, () => reset(), { immediate: true });

function onProbeLoad() {
  mode.value = "carousel";
}

function onProbeError() {
  if (first.value) {
    const next = new Set(failed.value);
    next.add(first.value);
    failed.value = next;
  }
  mode.value = "fallback";
}

function onImageError(src: string) {
  const next = new Set(failed.value);
  next.add(src);
  failed.value = next;

  // if everything fails, fall back
  if (validImages.value.length === 0) mode.value = "fallback";
}
</script>
