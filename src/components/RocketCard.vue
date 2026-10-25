<!-- A single rocket in the list: image, name, and truncated description. -->
<template>
  <v-card
    class="rocket-card"
    :to="`/rockets/${rocket.id}`"
    height="100%"
    hover
  >
    <v-img
      :alt="rocket.name"
      cover
      height="180"
      :src="image"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-surface-light">
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="48"
          />
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title>{{ rocket.name }}</v-card-title>
    </v-card-item>

    <v-card-text class="rocket-card__desc">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()

  const image = computed(() => props.rocket.flickr_images[0] ?? '')
</script>

<style scoped>
.rocket-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
