<template>
  <v-card
    :to="{ path: `/rockets/${rocket.id}` }"
    class="h-100 d-flex flex-column"
    variant="outlined"
    hover
  >
    <RocketImage :src="rocket.imageUrl" :alt="rocket.fullName" />

    <v-card-item>
      <v-card-title class="text-wrap">{{ rocket.fullName }}</v-card-title>
      <template v-if="rocket.isLocal" #append>
        <v-chip size="small" color="primary" variant="tonal">Added by you</v-chip>
      </template>
    </v-card-item>

    <v-card-text class="text-medium-emphasis flex-grow-1">
      {{ rocket.description || 'No description available for this rocket yet.' }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import RocketImage from '@/components/RocketImage.vue'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>
