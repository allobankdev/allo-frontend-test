<!-- Responsive grid of rocket cards; shows an empty message when nothing matches. -->
<template>
  <div>
    <v-row v-if="rockets.length">
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <div
      v-else
      class="text-center text-medium-emphasis py-12"
    >
      <v-icon
        class="mb-2"
        icon="mdi-magnify"
        size="40"
      />
      <p>No rockets match your search.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import RocketCard from './RocketCard.vue'
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rockets: Rocket[] }>()
</script>
