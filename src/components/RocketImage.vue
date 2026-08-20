<template>
  <div class="rocket-image">
    <v-img
      v-if="showImage"
      :alt="alt"
      class="rocket-image__asset"
      :src="src!"
      @error="hasFailed = true"
    >
      <template #placeholder>
        <div class="rocket-image__loading">
          <v-progress-circular
            aria-label="Loading rocket image"
            color="primary"
            indeterminate
            size="28"
            width="2"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      :aria-label="`${alt}. Image not available.`"
      class="rocket-image__fallback"
      role="img"
    >
      <v-icon
        icon="mdi-rocket-outline"
        size="42"
      />
      <span>Image not available</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    src: string | null
    alt: string
  }>()

  const hasFailed = ref(false)
  const showImage = computed(() => Boolean(props.src) && !hasFailed.value)

  watch(() => props.src, () => {
    hasFailed.value = false
  })
</script>
