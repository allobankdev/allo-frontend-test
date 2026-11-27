<template>
  <v-card class="h-100" :to="`/rockets/${rocket.id}`" variant="outlined" rounded="lg">
    <v-img v-if="textValue(rocket.image_url) && !imageFailed" :alt="rocketName(rocket)"
      :src="textValue(rocket.image_url)" height="240" cover @error="imageFailed = true" />
    <div v-else class="d-flex flex-column align-center justify-center bg-surface-variant" style="height: 240px">
      <v-icon icon="mdi-rocket-launch-outline" size="48" aria-hidden="true" />
      <span class="text-body-2 mt-3">Gambar tidak tersedia</span>
    </div>
    <div class="pa-5">
      <h2 class="text-h6 mb-3">
        {{ rocketName(rocket) }}
      </h2>
      <p class="text-body-2 text-medium-emphasis rocket-description">
        {{ rocketDescription(rocket) }}
      </p>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'
import { rocketDescription, rocketName, textValue } from '@/utils/rocketDisplay'

const props = defineProps<{ rocket: Rocket }>()
const imageFailed = ref(false)

watch(() => props.rocket.image_url, () => {
  imageFailed.value = false
})
</script>

<style scoped>
.rocket-description,
h2 {
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
