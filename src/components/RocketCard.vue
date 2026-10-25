<template>
  <v-card
    class="h-100 d-flex flex-column rocket-card"
    hover
    @click="$emit('select', rocket.id)"
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      height="220"
      cover
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
          <v-progress-circular
            indeterminate
            color="primary"
            size="24"
          />
        </div>
      </template>
      <template #error>
        <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-3 text-grey">
          <v-icon
            icon="mdi-rocket-outline"
            size="48"
          />
          <span class="text-caption mt-1">Gambar gak tersedia</span>
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="d-flex flex-column align-center justify-center bg-grey-lighten-3 text-grey"
      style="height: 220px;"
    >
      <v-icon
        icon="mdi-rocket-outline"
        size="48"
      />
      <span class="text-caption mt-1">Gak ada gambar</span>
    </div>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">
        {{ rocket.full_name || 'Roket Tanpa Nama' }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis">
      <p class="description-clamp">
        {{ rocket.description || 'Belum ada deskripsi buat roket ini.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'

defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  (e: 'select', id: number | string): void
}>()
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
