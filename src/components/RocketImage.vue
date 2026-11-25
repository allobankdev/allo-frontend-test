<!--
  Fungsi: Nampilin foto roket. Kalau image_url kosong/null atau gambarnya gagal load,
          otomatis ganti ke kotak fallback biar tampilan nggak pecah.
  Props:
    - src: URL gambar dari API atau input user (bisa null)
    - alt: teks alt buat aksesibilitas
    - height: tinggi gambar (default 220px)
  Dipakai di:
    - src/components/RocketCard.vue
    - src/pages/rockets/[id].vue
-->

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  src: string | null
  alt: string
  height?: string
}>()

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  },
)
</script>

<template>
  <div
    v-if="!src || hasError"
    class="image-fallback"
    :style="{ height: height ?? '210px' }"
    role="img"
    :aria-label="`${alt} (image unavailable)`"
  >
    <div class="fallback-inner">
      <v-icon
        icon="mdi-rocket-outline"
        size="26"
        class="mb-2"
      />
      <span class="font-mono">NO TELEMETRY IMAGE</span>
    </div>
  </div>
  <img
    v-else
    :src="src"
    :alt="alt"
    class="rocket-img"
    :style="{ height: height ?? '210px' }"
    loading="lazy"
    @error="hasError = true"
  >
</template>

<style scoped>
.rocket-img {
  width: 100%;
  object-fit: cover;
  object-position: center 25%;
  display: block;
  background-color: var(--console);
}

.image-fallback {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background-color: #121417;
  color: var(--ink-muted);
}

.fallback-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
}

.fallback-icon {
  color: var(--ink-muted);
}
</style>