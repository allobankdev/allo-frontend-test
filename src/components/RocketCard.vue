<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl transition-swing bg-allo-card border-subtle"
    elevation="3"
    hover
    @click="goToDetail"
  >
    <!-- Rocket Image with Fallback -->
    <v-img
      :src="imageSrc"
      height="220"
      cover
      class="align-end bg-grey-darken-3"
      @error="handleImageError"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
          <v-progress-circular
            indeterminate
            color="#ffbc25"
            size="32"
          />
        </div>
      </template>

      <!-- Gradient overlay for text contrast -->
      <div class="image-gradient px-4 py-2">
        <div class="d-flex align-center justify-space-between">
          <v-chip
            v-if="rocket.is_local"
            color="#ffbc25"
            size="x-small"
            variant="flat"
            class="font-weight-bold text-black"
          >
            Custom Added
          </v-chip>
          <v-chip
            v-else-if="rocket.active !== undefined"
            :color="rocket.active ? '#17a16e' : '#8b95a5'"
            size="x-small"
            variant="flat"
            class="font-weight-bold"
          >
            {{ rocket.active ? 'Active' : 'Retired' }}
          </v-chip>

          <v-chip
            size="x-small"
            color="blue-grey-lighten-4"
            variant="outlined"
            class="font-weight-medium bg-black-opacity"
          >
            {{ countryCode }}
          </v-chip>
        </div>
      </div>
    </v-img>

    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold text-white text-truncate font-montserrat">
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
      <v-card-subtitle class="text-caption text-allo-yellow font-weight-medium">
        {{ rocket.manufacturer?.name || 'SpaceX' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2 pb-3">
      <p class="text-body-2 text-grey-lighten-2 rocket-description">
        {{ truncatedDescription }}
      </p>
    </v-card-text>

    <v-divider class="border-divider" />

    <v-card-actions class="px-4 py-3 card-footer justify-space-between align-center">
      <div class="text-caption text-grey">
        <span class="d-block text-xxs font-weight-medium text-grey-lighten-1">MAIDEN FLIGHT</span>
        <span class="text-grey-lighten-2 font-weight-semibold">{{ formattedMaidenFlight }}</span>
      </div>

      <v-btn
        color="#ffbc25"
        variant="text"
        size="small"
        append-icon="mdi-arrow-right"
        class="font-weight-bold px-2"
        @click.stop="goToDetail"
      >
        View Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()
const imageFailed = ref(false)

const imageSrc = computed(() => {
  if (imageFailed.value || !props.rocket.image_url) {
    return DEFAULT_ROCKET_IMAGE
  }
  return props.rocket.image_url
})

function handleImageError() {
  imageFailed.value = true
}

const countryCode = computed(() => {
  return props.rocket.manufacturer?.country_code || props.rocket.country || 'USA'
})

const formattedMaidenFlight = computed(() => {
  return formatDate(props.rocket.maiden_flight)
})

const truncatedDescription = computed(() => {
  const desc = props.rocket.description
  if (!desc || !desc.trim()) {
    return 'No description available for this launch vehicle.'
  }
  if (desc.length > 130) {
    return desc.slice(0, 130) + '...'
  }
  return desc
})

function goToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.bg-allo-card {
  background-color: #131c2e !important;
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.card-footer {
  background-color: #0f1626 !important;
}
.text-allo-yellow {
  color: #ffbc25 !important;
}
.font-montserrat {
  font-family: 'Montserrat', sans-serif !important;
}
.border-divider {
  border-color: rgba(255, 255, 255, 0.06) !important;
}
.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5) !important;
  border-color: rgba(255, 188, 37, 0.3) !important;
}
.image-gradient {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(10, 15, 30, 0.95) 100%);
  width: 100%;
}
.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.55);
}
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 4.5em;
}
.text-xxs {
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}
</style>
