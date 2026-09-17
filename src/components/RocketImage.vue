<template>
  <v-img
    v-if="src && !failed"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    class="bg-grey-lighten-3"
    cover
    :src="src"
    @error="failed = true"
  >
    <template #placeholder>
      <div class="fill">
        <v-progress-circular
          indeterminate
          size="24"
          width="2"
        />
      </div>
    </template>
  </v-img>

  <v-responsive
    v-else
    :aspect-ratio="aspectRatio"
    class="bg-grey-lighten-3"
  >
    <div class="fill text-medium-emphasis">
      <v-icon
        icon="mdi-image-off-outline"
        size="32"
      />
      <span class="text-caption">No image</span>
    </div>
  </v-responsive>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src?: string | null
    alt?: string
    aspectRatio?: number
  }>(), {
    src: null,
    alt: '',
    aspectRatio: 4 / 3,
  })

  const failed = ref(false)

  watch(() => props.src, () => {
    failed.value = false
  })
</script>

<style scoped>
.fill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
}
</style>
