<template>
  <v-card
    class="rocket-card d-flex flex-column"
    height="100%"
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
  >
    <!-- flex-grow-0: keep the 16:9 ratio instead of absorbing spare height in short cards. -->
    <RocketImage
      :alt="rocket.name"
      class="flex-grow-0"
      :src="rocket.imageUrl"
    />

    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.name }}
      </v-card-title>
      <template #append>
        <v-chip
          v-if="rocket.isCustom"
          color="secondary"
          label
          size="small"
          variant="tonal"
        >
          Added by you
        </v-chip>
      </template>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p
        v-if="rocket.description"
        class="rocket-card__description"
      >
        {{ rocket.description }}
      </p>
      <p
        v-else
        class="text-disabled font-italic"
      >
        No description available.
      </p>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <RocketStatusChip :active="rocket.active" />
      <v-spacer />
      <span class="text-caption text-medium-emphasis">View details</span>
      <v-icon
        icon="mdi-chevron-right"
        size="small"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
  .rocket-card__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
</style>
