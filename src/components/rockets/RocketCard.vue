<template>
  <v-card
    border
    class="rocket-card d-flex flex-column fill-height"
    color="#0f172a"
    rounded="xl"
    variant="flat"
  >
    <RocketImage
      :alt="rocketName"
      :height="200"
      :src="rocket.image_url"
    />

    <v-card-item class="pt-5 pb-2 px-5">
      <v-card-title class="text-h6 font-weight-bold text-white text-wrap">
        {{ rocketName }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="px-5 pt-0 pb-4 flex-grow-1">
      <p class="rocket-description text-body-2 text-medium-emphasis mb-0">
        {{ rocketDescription }}
      </p>
    </v-card-text>

    <v-card-actions class="px-5 pb-5 pt-0">
      <v-btn
        append-icon="mdi-arrow-right"
        block
        color="primary"
        rounded="lg"
        :to="detailPath"
        variant="tonal"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatDescription, formatRocketName } from '@/utils/rocketFormatter'

interface Props {
  rocket: Rocket
}

const props = defineProps<Props>()

const rocketName = computed(() => formatRocketName(props.rocket.full_name))
const rocketDescription = computed(() => formatDescription(props.rocket.description))
const detailPath = computed(() => `/rockets/${props.rocket.id}`)
</script>

<style scoped>
.rocket-card {
  border-color: rgba(148, 163, 184, 0.16) !important;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.rocket-card:hover {
  border-color: rgba(59, 130, 246, 0.5) !important;
  transform: translateY(-2px);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
