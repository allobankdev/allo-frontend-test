<template>
  <RouterLink
    :to="`/rocket/${rocket.id}`"
    class="rocket-card"
  >
    <div
      class="card-image"
      :class="`tone-${index % 4}`"
    >
      <RocketArtwork />
      <img
        v-if="rocket.image_url && imageAvailable"
        class="rocket-photo"
        :src="rocket.image_url"
        :alt="rocket.full_name || 'Rocket'"
        loading="lazy"
        @error="imageAvailable = false"
      >
      <span
        v-if="!rocket.image_url || !imageAvailable"
        class="fallback-tag"
      >Illustration</span>
      <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
      <span
        v-if="rocket.isLocal"
        class="local-tag"
      >New</span>
      <span
        class="card-arrow"
        aria-hidden="true"
      >↗</span>
    </div>

    <div class="card-content">
      <div class="card-title">
        <h2>{{ rocket.full_name || 'Unnamed launcher' }}</h2>
        <span class="country-tag">{{ rocket.manufacturer?.country_code || '—' }}</span>
      </div>
      <p class="card-description">
        {{ rocket.description || 'No description is available for this launcher yet.' }}
      </p>
      <div class="card-footer">
        <span>First flight</span>
        <span>{{ formatDate(rocket.maiden_flight) }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RocketArtwork from '@/components/RocketArtwork.vue'
import type { Rocket } from '@/types/rocket'
import { formatDate } from '@/utils/rocket'

defineProps<{ rocket: Rocket; index: number }>()

const imageAvailable = ref(true)
</script>
