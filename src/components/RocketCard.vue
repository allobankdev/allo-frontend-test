<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="4"
    hover
    rounded="0"
  >
    <!-- Gambar Roket jika ada -->
    <v-img
      v-if="hasImage"
      :src="imageSrc"
      height="220"
      cover
      class="bg-grey-lighten-3 align-end text-white"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </template>

      <template #error>
        <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-2 text-grey-darken-1">
          <v-icon size="48" icon="mdi-rocket-launch-outline"></v-icon>
          <span class="text-caption mt-1">No Image Available</span>
        </div>
      </template>

      <!-- Badge Penanda jika Roket Dibuat oleh User -->
      <v-chip
        v-if="rocket.is_custom"
        color="secondary"
        size="small"
        class="ma-2 font-weight-bold"
        variant="elevated"
      >
        User Created
      </v-chip>
    </v-img>

    <!-- Tampilan khusus jika roket TIDAK memiliki gambar -->
    <div
      v-else
      class="d-flex flex-column align-center justify-center bg-grey-lighten-2 text-grey-darken-1 position-relative"
      style="height: 220px;"
    >
      <v-icon size="48" icon="mdi-rocket-launch-outline"></v-icon>
      <span class="text-caption mt-1">No Image Available</span>

      <!-- Badge Penanda jika Roket Dibuat oleh User -->
      <v-chip
        v-if="rocket.is_custom"
        color="secondary"
        size="small"
        class="ma-2 font-weight-bold position-absolute top-0 left-0"
        variant="elevated"
      >
        User Created
      </v-chip>
    </div>

    <!-- Nama Roket -->
    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
    </v-card-item>

    <!-- Ringkasan Deskripsi Roket -->
    <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis">
      <p class="description-text">
        {{ formattedDescription }}
      </p>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Tombol Navigasi ke Detail Roket -->
    <v-card-actions class="pa-4">
      <v-btn
        color="primary"
        variant="elevated"
        block
        append-icon="mdi-arrow-right"
        :to="`/rockets/${rocket.id}`"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

// Props: Menerima 1 objek data roket dari parent component
const props = defineProps<{
  rocket: Rocket
}>()

// Cek apakah roket memiliki image_url
const hasImage = computed(() => {
  return !!(props.rocket.image_url && props.rocket.image_url.trim())
})

// Gambar roket
const imageSrc = computed(() => {
  return props.rocket.image_url?.trim() || ''
})

// Computed: Pemotongan teks deskripsi maks 140 karakter
const formattedDescription = computed(() => {
  const desc = props.rocket.description?.trim()
  if (!desc) {
    return 'No description available for this rocket.'
  }
  return desc.length > 140 ? desc.slice(0, 140) + '...' : desc
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.5em;
  margin: 0;
}
</style>
