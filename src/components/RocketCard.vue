<template>
  <v-card
    border
    class="rocket-card d-flex flex-column fill-height"
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
  >
    <div class="rocket-card__media">
      <RocketImage
        :alt="rocket.name"
        :src="rocket.imageUrl"
      />
      <v-chip
        v-if="rocket.isLocal"
        class="rocket-card__badge"
        color="primary"
        size="small"
        variant="flat"
      >
        Added by you
      </v-chip>
    </div>

    <v-card-item class="pt-4">
      <v-card-title class="text-h6 font-weight-bold text-wrap pa-0">
        {{ rocket.name }}
      </v-card-title>
      <div
        v-if="rocket.country || firstFlightYear"
        class="d-flex flex-wrap ga-2 mt-2"
      >
        <v-chip
          v-if="rocket.country"
          prepend-icon="mdi-flag-outline"
          size="small"
          variant="tonal"
        >
          {{ rocket.country }}
        </v-chip>
        <v-chip
          v-if="firstFlightYear"
          prepend-icon="mdi-calendar-outline"
          size="small"
          variant="tonal"
        >
          First flight {{ firstFlightYear }}
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p
        class="rocket-card__description text-body-2 text-medium-emphasis"
        :class="{ 'font-italic': !rocket.description }"
      >
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <span class="text-body-2 font-weight-semibold text-primary d-inline-flex align-center ga-1">
        View details
        <v-icon
          class="rocket-card__arrow"
          icon="mdi-arrow-right"
          size="16"
        />
      </span>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import RocketImage from './RocketImage.vue'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const firstFlightYear = computed(() => props.rocket.firstFlight?.slice(0, 4) ?? null)
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.4) !important;
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, 0.18);
}

/* The lift + border already signal hover; skip Vuetify's grey overlay. */
.rocket-card :deep(.v-card__overlay) {
  display: none;
}

.rocket-card__media {
  position: relative;
  overflow: hidden;
}

.rocket-card__media :deep(.v-img__img) {
  transition: transform 0.4s ease;
}

.rocket-card:hover .rocket-card__media :deep(.v-img__img) {
  transform: scale(1.05);
}

.rocket-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.rocket-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.rocket-card__arrow {
  transition: transform 0.2s ease;
}

.rocket-card:hover .rocket-card__arrow {
  transform: translateX(3px);
}
</style>
