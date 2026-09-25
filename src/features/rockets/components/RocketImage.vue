<template>
  <div
    class="rocket-image"
    :style="{ height }"
  >
    <v-img
      v-if="src && !imageFailed"
      :alt="alt"
      class="h-100"
      cover
      :src="src"
      @error="imageFailed = true"
    >
      <template #placeholder>
        <div class="d-flex fill-height align-center justify-center">
          <v-progress-circular
            color="primary"
            indeterminate
            size="28"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="rocket-image__fallback"
    >
      <v-icon
        color="primary"
        size="56"
      >
        mdi-rocket-launch-outline
      </v-icon>
      <span>Gambar tidak tersedia</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src?: string | null
    alt: string
    height?: string
  }>(), {
    src: null,
    height: '220px',
  })

  const imageFailed = ref(false)

  watch(() => props.src, () => {
    imageFailed.value = false
  })
</script>

<style scoped>
.rocket-image {
  overflow: hidden;
  background: linear-gradient(145deg, #121b31, #18284a);
}

.rocket-image__fallback {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.875rem;
}
</style>
