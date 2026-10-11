<template>
  <v-row>
    <v-col v-for="item in items" :key="item.id" cols="12" md="4">
      <CardItem :item="item" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type {Rocket} from '@/types/Rocket'

defineProps<{items: Rocket[]}>()
</script>
