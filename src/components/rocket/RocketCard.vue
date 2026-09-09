<script lang="ts" setup>
import { mdiRocketLaunchOutline } from '@/constants/icons'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
defineEmits<{ click: [rocket: Rocket] }>()
</script>

<template>
  <v-card
    class="rocket-card h-100"
    hover
    link
    rounded="xl"
    @click="$emit('click', rocket)"
  >
    <div class="rocket-card-media">
      <v-img
        v-if="rocket.imageUrl"
        class="rocket-card-image"
        cover
        height="190"
        :src="rocket.imageUrl"
      >
        <template #error>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
            <v-icon
              :icon="mdiRocketLaunchOutline"
              size="48"
            />
          </div>
        </template>
      </v-img>
      <div
        v-else
        class="rocket-card-image d-flex align-center justify-center bg-grey-lighten-2"
        style="height: 190px"
      >
        <v-icon
          :icon="mdiRocketLaunchOutline"
          size="48"
        />
      </div>

      <v-chip
        v-if="rocket.country"
        class="rocket-card-country-chip text-uppercase font-weight-bold"
        color="white"
        size="x-small"
        variant="flat"
      >
        {{ rocket.country }}
      </v-chip>
    </div>

    <v-card-title class="text-truncate font-weight-bold">
      {{ rocket.name }}
    </v-card-title>
    <v-card-text class="rocket-card-description text-body-2 text-medium-emphasis">
      <FallbackText
        fallback="Deskripsi belum tersedia"
        :value="rocket.description"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card-media {
  position: relative;
  overflow: hidden; /* clips the hover zoom so it doesn't spill past the card edges */
}

.rocket-card-image {
  transition: transform 0.35s ease;
}

.rocket-card:hover .rocket-card-image {
  transform: scale(1.08);
}

.rocket-card-country-chip {
  position: absolute;
  top: 8px;
  right: 8px;
}

.rocket-card-description {
  min-height: 3.6em;
}
</style>
