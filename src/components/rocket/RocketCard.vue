<template>
  <v-card
    class="rocket-card cursor-pointer h-100 overflow-hidden"
    rounded="lg"
    variant="outlined"
    tabindex="0"
    role="button"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="position-relative">
      <AppImage
        :src="rocket.image_url"
        :alt="rocket.full_name"
      />
      <v-chip
        v-if="countryCode"
        class="country-chip"
        size="x-small"
        variant="flat"
        color="background"
      >
        {{ countryFlag(countryCode) }} {{ countryCode }}
      </v-chip>
    </div>

    <v-card-item>
      <template #title>
        <div class="d-flex align-center ga-2">
          <span class="text-h6 rocket-title">{{ rocket.full_name }}</span>
          <v-chip
            v-if="rocket.isLocal"
            size="x-small"
            color="success"
            variant="flat"
          >
            LOKAL
          </v-chip>
        </div>
      </template>
      <template #subtitle>
        <p class="text-body-2 text-medium-emphasis mt-1 line-clamp-2 rocket-desc">
          {{ fallbackText(rocket.description, 'No description available') }}
        </p>
      </template>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { fallbackText, countryFlag } from '@/utils/formatters'
import AppImage from '@/components/common/AppImage.vue'

const props = defineProps<{ rocket: Rocket }>()
defineEmits<{ click: [] }>()

const countryCode = computed(() => props.rocket.manufacturer?.country_code ?? null)
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }

.rocket-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.rocket-card:hover {
  transform: scale(1.02);
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 8px 28px rgba(var(--v-theme-primary), 0.18);
}

.country-chip {
  position: absolute;
  top: 8px;
  right: 8px;
}

.rocket-title {
  font-weight: 600;
}

.rocket-desc {
  opacity: 0.7;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
