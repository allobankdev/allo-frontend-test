<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/stores/rocketStore'

const props = defineProps<{ rocket: Rocket }>()
const router = useRouter()

const imgError = ref(false)

function handleImageError() {
  imgError.value = true
}
</script>

<template>
  <v-card
    rounded="lg"
    elevation="2"
    class="rocket-card"
    @click="router.push(`/rocket/${props.rocket.id}`)"
  >
    <v-img
      v-if="!imgError && props.rocket.flickr_images?.[0]"
      :src="props.rocket.flickr_images[0]"
      height="200"
      cover
      @error="handleImageError"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="grey-lighten-4" />
        </div>
      </template>
    </v-img>
    <v-img
      v-else
      src="https://placehold.co/600x200/1a1a2e/white?text=No+Image"
      height="200"
      cover
    />

    <v-chip
      v-if="props.rocket.isLocal"
      color="secondary"
      size="small"
      class="ma-2 position-absolute"
      style="top: 0; right: 0"
    >
      Custom
    </v-chip>

    <v-card-title class="pt-3">{{ props.rocket.name }}</v-card-title>
    <v-card-subtitle v-if="props.rocket.country">
      <v-icon icon="mdi-earth" size="14" class="mr-1" />{{ props.rocket.country }}
    </v-card-subtitle>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis line-clamp-2">{{ props.rocket.description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-chip
        :color="props.rocket.active ? 'success' : 'default'"
        size="small"
        variant="tonal"
      >
        {{ props.rocket.active ? 'Aktif' : 'Tidak Aktif' }}
      </v-chip>
      <v-spacer />
      <v-btn variant="text" color="primary" size="small" append-icon="mdi-arrow-right">
        Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
