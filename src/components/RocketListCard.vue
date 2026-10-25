<script setup lang="ts">
import type { Rocket } from '@/stores/rocketStore'

defineProps<{
  rocket: Rocket
}>()

const emit = defineEmits<{
  (e: 'click', id: string | number): void
}>()
</script>

<template>
  <v-card class="mx-auto h-100 d-flex flex-column" hover @click="emit('click', rocket.id)">

    <v-img
      :src="rocket.image_url || 'https://via.placeholder.com/400x250?text=No+Rocket+Image'"
      height="200"
      cover
      class="bg-grey-lighten-2"
      >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="grey-lighten-4" />
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="font-weight-bold">
        {{ rocket.full_name || 'Unnamed Rocket' }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2 text-truncate-2">
        {{ rocket.description || 'No description provided' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
