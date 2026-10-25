<template>
  <v-card
    class="rocket-card d-flex flex-column"
    height="100%"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <div class="rocket-card__media">
      <v-img
        v-if="rocket.imageUrl && !imageFailed"
        cover
        height="180"
        :src="rocket.imageUrl"
        @error="imageFailed = true"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="primary"
              indeterminate
              size="28"
            />
          </div>
        </template>
      </v-img>

      <div
        v-else
        class="rocket-card__media-fallback d-flex align-center justify-center"
        style="height: 180px;"
      >
        <v-icon
          color="disabled"
          icon="mdi-rocket-launch-outline"
          size="48"
        />
      </div>

      <v-chip
        v-if="rocket.isCustom"
        class="rocket-card__badge"
        color="accent"
        size="small"
        variant="flat"
      >
        Added by you
      </v-chip>
    </div>

    <v-card-item class="pb-0">
      <v-card-title class="rocket-card__title">
        {{ rocket.fullName }}
      </v-card-title>
      <v-card-subtitle v-if="rocket.family">
        {{ rocket.family }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="rocket-card__description flex-grow-1 pt-2 pb-1">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-text class="d-flex ga-1 pt-2">
      <v-chip
        v-if="rocket.active"
        color="success"
        size="small"
        variant="tonal"
      >
        Active
      </v-chip>
      <v-chip
        v-if="rocket.reusable"
        color="info"
        size="small"
        variant="tonal"
      >
        Reusable
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import { formatText } from '@/utils/format'

  const props = defineProps<{
    rocket: Rocket
  }>()

  // Falls back to a placeholder icon if the image URL 404s or is unreachable,
  // in addition to the case where the API never gave us a URL at all.
  const imageFailed = ref(false)

  // Card descriptions are capped to a fixed character count (rather than
  // relying on CSS line-clamping alone) so every card shows a consistent,
  // predictable amount of text regardless of font, zoom level, or browser.
  const DESCRIPTION_LIMIT = 110

  const truncatedDescription = computed(() => {
    const text = formatText(props.rocket.description)
    if (text.length <= DESCRIPTION_LIMIT) return text
    return `${text.slice(0, DESCRIPTION_LIMIT).trimEnd()}…`
  })
</script>

<style scoped>
.rocket-card__media {
  position: relative;
}

.rocket-card__media-fallback {
  background: rgba(128, 128, 128, 0.08);
}

.rocket-card__badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.rocket-card__title {
  white-space: normal;
  line-height: 1.3;
}

.rocket-card__description {
  overflow: hidden;
}
</style>
