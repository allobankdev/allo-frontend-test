<template>
  <v-card
    class="h-100"
    :class="{ 'rocket-card--selected': selected }"
    hover
    :to="`/rockets/${rocket.id}`"
    variant="outlined"
  >
    <RocketImage
      :alt="formatText(rocket.full_name, 'Rocket')"
      :src="rocket.image_url"
    />

    <v-card-title class="text-wrap">
      {{ formatText(rocket.full_name, 'Unnamed Rocket') }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis text-truncate-3">
        {{ formatText(rocket.description, 'No description available.') }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import RocketImage from '@/components/rocket/RocketImage.vue'
  import type { Rocket } from '@/types/rocket'
  import { formatText } from '@/utils/formatters'
  import {onMounted} from "vue";

   const props = withDefaults(defineProps<{
    rocket: Rocket
    selected?: boolean
  }>(), {
    selected: false,
  })
  onMounted(() => {
    console.log('RocketCard mounted', props.rocket, "<<")
  })
</script>

<style scoped>
.rocket-card--selected {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
