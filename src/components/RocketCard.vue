<template>
  <v-card
    class="h-100"
    elevation="2"
    @click="$emit('select', rocket.id)"
  >
    <v-img
      :src="rocket.image_url || undefined"
      height="220"
      cover
      alt="Rocket image"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon
            icon="mdi-rocket-launch"
            size="64"
            class="text-medium-emphasis"
          />
        </div>
      </template>
    </v-img>

    <v-card-title>
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      {{ rocket.description || 'No description available.' }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  select: [id: number]
}>()
</script>
