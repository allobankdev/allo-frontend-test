<template>
  <v-card
    class="rocket-card d-flex flex-column h-100"
    :to="{ name: '/rockets.[id]', params: { id: rocket.id } }"
  >
    <RocketImage
      :alt="rocket.name"
      :height="180"
      :src="rocket.imageUrl"
    />

    <v-card-item>
      <v-card-title class="text-wrap text-body-1 font-weight-medium">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle
        v-if="rocket.isLocal"
        class="pt-1"
      >
        <v-chip
          color="primary"
          density="comfortable"
          size="x-small"
          variant="tonal"
        >
          Added by you
        </v-chip>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="pt-0 text-medium-emphasis">
      {{ description }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { formatText, NOT_AVAILABLE, truncate } from '@/utils/format'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()

  /** Descriptions vary from 26 to 260+ characters; trim so cards stay even. */
  const description = computed(() => {
    const text = formatText(props.rocket.description)
    return text === NOT_AVAILABLE ? 'No description available.' : truncate(text, 140)
  })
</script>

<style scoped>
  .rocket-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .rocket-card:hover {
    transform: translateY(-2px);
  }
</style>
