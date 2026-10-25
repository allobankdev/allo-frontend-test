<script setup lang="ts">
import {
  ref,
  watch,
} from 'vue'


const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
  }>(),
  {
    src: null,
    alt: 'Image',
  },
)


const imageFailed =
  ref(false)


function handleImageError() {
  imageFailed.value = true
}


watch(
  () => props.src,
  () => {
    imageFailed.value = false
  },
)
</script>


<template>
  <div class="safe-image">

    <img
      v-if="
        src &&
        !imageFailed
      "

      :src="src"
      :alt="alt"

      @error="
        handleImageError
      "
    >


    <div
      v-else
      class="safe-image-placeholder"
    >
      Image not available
    </div>

  </div>
</template>


<style scoped>
.safe-image {
  width: 100%;
  height: 100%;

  background: #eee;
}


.safe-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}


.safe-image-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  color: #999;

  text-align: center;
  font-size: 14px;
}
</style>
