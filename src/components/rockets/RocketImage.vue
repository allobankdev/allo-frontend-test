<template>
  <div
    v-if="!src"
    class="d-flex flex-column align-center justify-center text-grey bg-grey-darken-3"
    :style="{ height: heightStyle }"
  >
    <v-icon
      icon="mdi-rocket-launch-outline"
      size="40"
    />
    <span class="text-caption mt-1">Tidak ada gambar</span>
  </div>

  <v-img
    v-else
    :src="src"
    :height="height"
    cover
    class="bg-grey-darken-3"
  >
    <template #error>
      <div class="d-flex flex-column align-center justify-center fill-height text-grey">
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="40"
        />
        <span class="text-caption mt-1">Gambar tidak dapat dimuat</span>
      </div>
    </template>
  </v-img>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  src?: string | null
  height?: string | number
}>()

// v-img's own #placeholder/#error slots aren't reliable for a totally
// missing src across browsers, so we branch explicitly instead.
const heightStyle = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height ?? '200px',
)
</script>
