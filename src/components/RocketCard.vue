<template>
  <v-card
    class="rocket-card"
    :to="`/rockets/${rocket.id}`"
    hover
    rounded="lg"
  >
    <!-- Rocket image -->
    <v-img
      :src="rocket.image_url ?? undefined"
      :lazy-src="PLACEHOLDER_IMAGE"
      height="200"
      cover
    >
      <template #placeholder>
        <div class="rocket-card__image-placeholder">
          <v-icon
            icon="mdi-rocket"
            size="64"
            color="grey-lighten-1"
          />
        </div>
      </template>

      <!-- "Local" badge for user-added rockets -->
      <v-chip
        v-if="rocket.isLocal"
        class="rocket-card__local-badge"
        color="primary"
        size="small"
        label
      >
        Added by you
      </v-chip>
    </v-img>

    <v-card-title class="rocket-card__title">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text class="rocket-card__description text-body-2 text-medium-emphasis">
      {{ truncatedDescription }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
const DESCRIPTION_MAX_LENGTH = 120

const props = defineProps<{
  rocket: Rocket
}>()

const truncatedDescription = computed<string>(() => {
  const desc = props.rocket.description

  if (!desc) return 'No description available.'
  if (desc.length <= DESCRIPTION_MAX_LENGTH) return desc

  return `${desc.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}…`
})
</script>

<style scoped>
.rocket-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.rocket-card__image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface-variant));
}

.rocket-card__title {
  white-space: normal;
  line-height: 1.3;
}

.rocket-card__description {
  flex: 1;
}

.rocket-card__local-badge {
  position: absolute;
  top: 8px;
  left: 8px;
}
</style>
