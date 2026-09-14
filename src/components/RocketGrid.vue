<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="String(rocket.id)"
      cols="12"
      sm="6"
      md="4"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import RocketCard from '@/components/RocketCard.vue'
import type { Rocket } from '@/types/rocket'

defineProps<{ rockets: Rocket[] }>()
</script>
