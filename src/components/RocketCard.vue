<template>
  <v-card class="rocket-card" @click="goDetail">
    <v-img
      :src="rocket.flickr_images?.[0] || placeholder"
      height="200"
      cover
    />

    <v-card-title>{{ rocket.name }}</v-card-title>

    <v-card-text class="text-truncate">
      {{ rocket.description }}
    </v-card-text>

    <v-chip size="small" class="ma-2" :color="rocket.isApi ? 'primary' : 'grey'">
      {{ rocket.isApi ? 'API SpaceX' : 'Local' }}
    </v-chip>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ rocket: any }>()
const router = useRouter()

const placeholder = 'https://via.placeholder.com/400x200?text=Rocket'

function goDetail() {
  router.push(`/rocket/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
</style>