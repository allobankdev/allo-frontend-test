<template>
  <v-card
    class="h-100"
    :to="to"
    hover
    rounded="lg"
    variant="outlined"
  >
    <v-img
      :src="rocket.imageUrl || fallback"
      height="180"
      cover
    />

    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="text-body-2">
      <div class="line-clamp">
        {{ rocket.description }}
      </div>

      <div class="mt-3 d-flex flex-wrap ga-2">
        <v-chip size="small" label>{{ rocket.country }}</v-chip>
        <v-chip
          v-if="rocket.active !== undefined"
          size="small"
          label
          :color="rocket.active ? 'success' : 'warning'"
          variant="tonal"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>
        <v-chip v-if="rocket.isLocal" size="small" label variant="tonal">
          Local
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn variant="text" :to="to">Detail</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
  to: string
}>()

const fallback = 'https://via.placeholder.com/640x360?text=Rocket'
// silence unused
void props
</script>

<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
