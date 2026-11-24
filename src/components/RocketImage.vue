<template>
  <v-img
    v-if="url && !failed"
    :src="url"
    :alt="name"
    :height="height"
    cover
    @error="failed = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular indeterminate aria-label="Memuat gambar" />
      </div>
    </template>
  </v-img>
  <div
    v-else
    class="d-flex flex-column align-center justify-center bg-surface-variant pa-4"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="`Gambar ${name} tidak tersedia`"
  >
    <v-icon icon="mdi-rocket-launch-outline" size="48" aria-hidden="true" />
    <span class="mt-2">Gambar tidak tersedia</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { safeImageUrl } from "@/utils/rocket";

const props = withDefaults(
  defineProps<{
    src: string | null;
    name: string;
    height?: number;
  }>(),
  { height: 220 },
);
const url = computed(() => safeImageUrl(props.src));
const failed = ref(false);
watch(url, () => {
  failed.value = false;
});
</script>
