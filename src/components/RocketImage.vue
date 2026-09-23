<template>
  <div
    class="rocket-image-wrapper"
    :style="{ height }"
  >
    <v-img
      v-if="src && !hasError"
      :src="src"
      :alt="alt || 'Rocket image'"
      cover
      class="rocket-img"
      @error="handleError"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
          <v-progress-circular
            indeterminate
            color="white"
            size="24"
            width="2"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="rocket-placeholder d-flex flex-column align-center justify-center fill-height"
    >
      <v-icon
        icon="mdi-rocket-outline"
        size="48"
        color="grey-lighten-1"
        class="mb-2"
      />
      <span class="text-caption text-grey text-uppercase tracking-wider font-weight-medium">
        {{ alt || 'No Image Available' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    height?: string
  }>(),
  {
    src: null,
    alt: 'Rocket image',
    height: '220px'
  }
)

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  }
)

function handleError() {
  hasError.value = true
}
</script>

<style scoped>
.rocket-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #121214;
}

.rocket-img {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.rocket-image-wrapper:hover .rocket-img {
  transform: scale(1.03);
}

.rocket-placeholder {
  width: 100%;
  background: radial-gradient(circle at center, #1e1e24 0%, #101012 100%);
  border: 1px dashed #333338;
  padding: 1rem;
  text-align: center;
}

.tracking-wider {
  letter-spacing: 0.1em;
}
</style>
