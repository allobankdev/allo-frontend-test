<script setup lang="ts">
/**
 * RocketImage.vue
 *
 * Handles every image edge case in one place: missing URL, broken URL, and
 * slow loading. Used by both the list card and the detail screen.
 */

// Composables
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  height?: string | number
  eager?: boolean
}>(), {
  src: null,
  alt: 'Rocket image',
  height: 200,
  eager: false,
})

const failed = ref(false)

watch(() => props.src, () => {
  failed.value = false
})

const placeholderHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)
</script>

<template>
  <div class="rocket-image">
    <v-img
      v-if="src && !failed"
      :alt="alt"
      :eager="eager"
      :height="height"
      :src="src"
      cover
      @error="failed = true"
    >
      <template #placeholder>
        <div class="rocket-image__placeholder">
          <v-progress-circular
            color="primary"
            indeterminate
            size="24"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="rocket-image__placeholder"
      :style="{ height: placeholderHeight }"
      role="img"
      :aria-label="alt"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
      />
      <span class="text-caption">No image available</span>
    </div>
  </div>
</template>

<style scoped>
.rocket-image {
  border-radius: inherit;
  overflow: hidden;
  width: 100%;
}

.rocket-image__placeholder {
  align-items: center;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12), rgba(var(--v-theme-primary), 0.03));
  color: rgba(var(--v-theme-on-surface), 0.45);
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  width: 100%;
}
</style>
