<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card"
    elevation="0"
    height="100%"
    rounded="0"
  >
    <v-img :src="rocket.image_url ?? undefined" height="200" class="rocket-card__image" cover>
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height" style="background: #EFECE4;">
          <v-icon icon="mdi-rocket-launch-outline" size="40" style="color: var(--color-ink-soft);" />
        </div>
      </template>
    </v-img>

    <v-card-text class="pa-4">
      <h2 class="display-heading text-subtitle-1 font-weight-medium mb-2">
        {{ rocket.full_name }}
      </h2>
      <p class="text-body-2 text-truncate-3" style="color: var(--color-ink-soft);">
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.rocket-card {
  border: 1px solid var(--color-rule);
  background: #fff;
  transition: border-color 0.15s ease;
}

.rocket-card:hover {
  border-color: var(--color-accent);
}

.rocket-card__image {
  filter: grayscale(0.4);
  transition: filter 0.2s ease;
}

.rocket-card:hover .rocket-card__image {
  filter: grayscale(0);
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
