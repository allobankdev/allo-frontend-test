<template>
  <v-img
    v-if="src"
    :alt="alt"
    class="flex-grow-0"
    cover
    :height="height"
    :src="src"
  >
    <template #error>
      <div
        class="rocket-image-placeholder d-flex align-center justify-center flex-grow-0"
        :style="placeholderStyle"
      >
        <v-icon
          color="grey"
          icon="mdi-rocket-launch"
          size="48"
        />
      </div>
    </template>
  </v-img>
  <div
    v-else
    class="rocket-image-placeholder d-flex align-center justify-center flex-grow-0"
    :style="placeholderStyle"
  >
    <v-icon
      color="grey"
      icon="mdi-rocket-launch"
      size="48"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string | null
    alt: string
    height?: number | string
  }>(),
  {
    height: 180,
  },
)

const placeholderStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<style scoped>
.rocket-image-placeholder {
  background-color: rgba(128, 128, 128, 0.12);
}
</style>
