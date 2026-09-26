<script setup lang="ts">
import { ref, watch } from "vue";
import EmptyRocketImage from "@/assets/rocket-icon-preview.svg";

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line vue/require-default-prop
    src?: string | null;
    // eslint-disable-next-line vue/require-default-prop
    alt?: string | null;
    height?: string | number;
  }>(),
  { height: 160 },
);

const failed = ref(false);

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>

<template>
  <v-img
    v-if="props.src && !failed"
    :src="props.src"
    :alt="props.alt || 'Rocket'"
    :height="props.height"
    cover
    @error="failed = true"
  />
  <v-img
    v-else
    class="rocket-placeholder"
    :src="EmptyRocketImage"
    :alt="props.alt || 'Rocket image not available'"
    :height="props.height"
    contain
  />
</template>

<style scoped>
.rocket-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgb(var(--v-theme-surface-variant));
}
</style>
