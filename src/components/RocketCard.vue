<template>
  <v-card
    class="rocket-card d-flex flex-column"
    :to="{ name: 'rocket-detail', params: { id: rocket.id } }"
    link
    variant="flat"
  >
    <div class="rocket-card__media">
      <v-img
        v-if="showImage"
        :src="rocket.image_url ?? undefined"
        :alt="displayName"
        height="190"
        cover
        class="rocket-card__image"
        @error="imageFailed = true"
      >
        <template #placeholder>
          <div class="rocket-card__placeholder">
            <v-progress-circular indeterminate color="primary" size="28" />
          </div>
        </template>
      </v-img>

      <div v-else class="rocket-card__placeholder">
        <v-icon icon="mdi-rocket-launch-outline" size="48" />
        <span class="text-caption text-medium-emphasis">No image available</span>
      </div>

      <v-chip
        v-if="rocket.isLocal"
        class="rocket-card__badge"
        color="secondary"
        size="small"
        variant="flat"
      >
        Added by you
      </v-chip>
    </div>

    <v-card-item class="pb-1">
      <v-card-title class="text-h6 text-wrap">{{ displayName }}</v-card-title>
      <v-card-subtitle v-if="country" class="pt-1">
        <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1" />
        {{ country }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="rocket-card__description text-body-2 text-medium-emphasis">
        {{ description }}
      </p>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <span class="text-caption text-medium-emphasis">View details</span>
      <v-spacer />
      <v-icon icon="mdi-arrow-right" size="18" color="primary" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { Rocket } from '@/types/rocket'

const props = defineProps<{ rocket: Rocket }>()

const imageFailed = ref(false)

const displayName = computed(
  () => props.rocket.full_name || props.rocket.name || 'Unnamed rocket',
)

const description = computed(
  () => props.rocket.description?.trim() || 'No description available for this rocket yet.',
)

const country = computed(() => props.rocket.manufacturer?.country_code?.trim() || '')

const showImage = computed(() => Boolean(props.rocket.image_url) && !imageFailed.value)

watch(
  () => props.rocket.image_url,
  () => {
    imageFailed.value = false
  },
)
</script>

<style scoped>
.rocket-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
}

.rocket-card__media {
  position: relative;
  background: rgba(var(--v-theme-surface-variant), 0.45);
}

.rocket-card__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 190px;
  color: rgba(var(--v-theme-on-surface), 0.55);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.16),
    rgba(var(--v-theme-surface-variant), 0.55)
  );
}

.rocket-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.rocket-card__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  line-height: 1.55;
}
</style>
