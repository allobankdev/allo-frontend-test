<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    :to="{ name: '/rockets/[id]', params: { id: String(rocket.id) } }"
  >
    <RocketImage
      :alt="name"
      :src="rocket.image_url"
    />

    <v-card-item>
      <div class="d-flex align-center ga-2">
        <v-card-title class="pa-0 text-truncate">
          {{ name }}
        </v-card-title>
        <v-chip
          v-if="rocket.isLocal"
          class="flex-shrink-0"
        >
          New
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text class="pt-0">
      <p class="description">
        {{ description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getRocketDescription, getRocketName } from '@/utils/rocket'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()

  const name = computed(() => getRocketName(props.rocket))
  const description = computed(() => getRocketDescription(props.rocket))
</script>

<style scoped>
.rocket-card {
  transition: border-color 0.15s ease;
}

.rocket-card:hover {
  border-color: rgb(var(--v-theme-on-surface)) !important;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
