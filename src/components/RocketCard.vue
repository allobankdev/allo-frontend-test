<script setup lang="ts">
import fallback from '../assets/no-image.jpeg'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  rocket: any
}>()
</script>

<template>
  <v-card
    class="ma-4"
    max-width="400"
    @click="router.push(`/rocket/${rocket.id}`)"
    style="cursor: pointer"
  >
    
    <v-img
      :src="rocket.flickr_images?.[0]"
      height="200"
      cover
    >
      <template #error>
        <v-img :src="fallback" cover />
      </template>
    </v-img>

    <v-card-title>
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      {{ rocket.description }}
    </v-card-text>

  </v-card>
</template>
