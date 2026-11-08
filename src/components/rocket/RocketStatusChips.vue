<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

withDefaults(defineProps<{
  rocket: Rocket
  size?: 'x-small' | 'small' | 'default'
}>(), {
  size: 'small',
})
</script>

<template>
  <div class="d-flex flex-wrap ga-2">
    <v-chip
      v-if="rocket.source === 'local'"
      :size="size"
      color="secondary"
      prepend-icon="mdi-account-edit-outline"
      variant="tonal"
    >
      Added by you
    </v-chip>
    <v-chip
      v-if="rocket.isActive !== null"
      :color="rocket.isActive ? 'success' : undefined"
      :prepend-icon="rocket.isActive ? 'mdi-check-circle-outline' : 'mdi-archive-outline'"
      :size="size"
      variant="tonal"
    >
      {{ rocket.isActive ? 'Active' : 'Retired' }}
    </v-chip>
    <v-chip
      v-if="rocket.isReusable"
      :size="size"
      color="info"
      prepend-icon="mdi-recycle"
      variant="tonal"
    >
      Reusable
    </v-chip>
  </div>
</template>
