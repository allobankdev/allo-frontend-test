<template>
  <v-card
    class="h-100 d-flex flex-column"
    :to="`/rockets/${rocket.id}`"
    hover
  >
    <v-img
      :alt="name"
      cover
      height="220"
      :src="rocket.image_url || undefined"
    >
      <div
        v-if="!rocket.image_url"
        class="placeholder d-flex align-center justify-center h-100"
      >
        <v-icon
          icon="mdi-rocket-launch"
          size="64"
        />
      </div>
    </v-img>
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text class="text-body-2 flex-grow-1">
      {{ rocket.description || 'Description unavailable.' }}
    </v-card-text>
    <v-card-actions><span class="text-primary">View details</span><v-spacer /><v-icon icon="mdi-arrow-right" /></v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/stores/rockets'
const props = defineProps<{ rocket: Rocket }>()
const name = computed(() => props.rocket.full_name || 'Unnamed rocket')
</script>

<style scoped>.placeholder { background: #20252b; color: #8b949e; }</style>
