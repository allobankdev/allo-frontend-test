<template>
  <div
    v-if="showPlaceholder"
    class="d-flex flex-column align-center justify-center ga-2 bg-surface-variant text-medium-emphasis"
    :style="{ height: cssHeight }"
    role="img"
    :aria-label="`Gambar ${alt} tidak tersedia`"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="48"
    />
    <span class="text-caption">Gambar tidak tersedia</span>
  </div>

  <v-img
    v-else
    :alt="alt"
    cover
    :height="height"
    :src="src ?? undefined"
    @error="failed = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey-lighten-1"
          indeterminate
        />
      </div>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
  /**
   * Gambar rocket dengan placeholder saat URL kosong atau gambar gagal dimuat.
   */
  import { computed, ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    /** URL gambar, `null` jika rocket tidak punya gambar. */
    src: string | null
    /** Teks alternatif, biasanya nama rocket. */
    alt: string
    /** Tinggi gambar dalam piksel atau satuan CSS. */
    height?: number | string
  }>(), {
    height: 200,
  })

  const failed = ref(false)

  // Reset status gagal saat URL berganti, misalnya pindah ke rocket lain.
  watch(() => props.src, () => {
    failed.value = false
  })

  const showPlaceholder = computed(() => !props.src || failed.value)
  const cssHeight = computed(() =>
    typeof props.height === 'number' ? `${props.height}px` : props.height,
  )
</script>
