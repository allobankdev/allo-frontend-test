<script lang="ts" setup>
import type { Rocket } from '../stores/rocketStore'

defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <v-card
    class="rocket-card"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.image_url || 'https://via.placeholder.com/400x200?text=No+Image'"
      height="180"
      cover
    />
    <v-card-title>{{ rocket.full_name || 'Tanpa Nama' }}</v-card-title>
    <v-card-text>
      {{ rocket.description?.substring(0, 120) || 'Deskripsi tidak tersedia' }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
</style>
