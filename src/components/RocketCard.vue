<template>
  <v-card
    class="h-100"
    :to="`/rocket/${rocket.id}`"
    link
    variant="outlined"
  >
    <v-img
      :src="rocket.image || fallbackImage"
      height="220"
      cover
    />

    <v-card-title class="text-h6">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="text-body-2 text-medium-emphasis">
      {{ shortDescription }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Rocket } from '@/types/rocket'

  interface Props {
    rocket: Rocket
  }

  const props = defineProps<Props>()

  const fallbackImage = 'https://images2.imgbox.com/9a/96/nLppz9HW_o.png'

  const shortDescription = computed(() => {
    const text = props.rocket.description.trim()
    if (text.length <= 140) return text
    return `${text.slice(0, 140)}...`
  })
</script>
