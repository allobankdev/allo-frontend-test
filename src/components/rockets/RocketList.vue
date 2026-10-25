<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      sm="6"
      md="6"
      lg="4"
      xl="3"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import RocketCard from './RocketCard.vue'

interface Props {
  rockets: Rocket[]
}

defineProps<Props>()
</script>
