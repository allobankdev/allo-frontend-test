<!--
  RocketImage.vue
  Renders a rocket image with a fallback placeholder when image_url is null
  or the image fails to load. Keeps aspect ratio consistent across cards.
-->
<template>
  <v-img
    :src="src ?? undefined"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    cover
    @error="onError"
  >
    <template #placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey-lighten-1" />
      </v-row>
    </template>

    <!-- Fallback when there is no image or loading failed -->
    <template v-if="showFallback" #default>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <div class="text-center pa-4">
          <v-icon size="64" color="grey-darken-1">mdi-rocket</v-icon>
          <div class="text-caption text-grey-darken-1 mt-2">No image available</div>
        </div>
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string | null
    alt?: string
    aspectRatio?: number
  }>(),
  {
    alt: 'Rocket image',
    aspectRatio: 16 / 9,
  }
)

const hasError = ref(false)

// Reset error flag whenever the image source changes
watch(
  () => props.src,
  () => { hasError.value = false }
)

const showFallback = computed(() => !props.src || hasError.value)

function onError() {
  hasError.value = true
}
</script>
