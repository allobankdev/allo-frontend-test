<template>
  <v-card
    class="rocket-card d-flex flex-column h-100"
    rounded="xl"
    elevation="4"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
  >
    <v-img
      :src="rocket.image_url || undefined"
      height="220"
      cover
      class="rocket-card__image flex-shrink-0"
    >
      <template #placeholder>
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <v-icon
            size="64"
            color="grey-darken-1"
            icon="mdi-rocket-launch-outline"
          />
        </v-row>
      </template>
      <template #error>
        <v-row
          class="fill-height"
          align="center"
          justify="center"
          style="background: rgba(30,30,40,0.85)"
        >
          <v-icon
            size="64"
            color="grey-darken-1"
            icon="mdi-rocket-launch-outline"
          />
        </v-row>
      </template>
    </v-img>

    <v-card-title class="rocket-card__title text-h6 font-weight-bold pt-4 pb-1 text-center">
      {{ rocket.full_name }}
    </v-card-title>

    <div class="rocket-card__cost-container text-center mb-1">
      <v-chip
        v-if="formattedCost"
        size="small"
        color="success"
        variant="tonal"
        prepend-icon="mdi-currency-usd"
      >
        {{ formattedCost }}
      </v-chip>
      <v-chip
        v-else
        size="small"
        color="grey"
        variant="tonal"
      >
        Cost: N/A
      </v-chip>
    </div>

    <v-card-text class="rocket-card__description text-body-2 text-medium-emphasis flex-grow-1">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-actions class="px-4 pb-3 align-center justify-center flex-shrink-0">
      <v-btn
        variant="tonal"
        color="primary"
        append-icon="mdi-arrow-right"
        size="small"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  click: []
}>()

const formattedCost = computed(() => {
  if (!props.rocket.launch_cost) return null
  const cleanDigits = props.rocket.launch_cost.toString().replace(/,/g, '')
  const num = Number(cleanDigits)
  if (isNaN(num)) return props.rocket.launch_cost
  return `${num.toLocaleString('en-US')}`
})

const truncatedDescription = computed(() => {
  if (!props.rocket.description) return 'No description available.'
  return props.rocket.description
})
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
}
.rocket-card__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rocket-card__cost-container {
  min-height: 28px;
}
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.2em;
  max-height: 4.2em;
  line-height: 1.4;
}
.rocket-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(100, 180, 255, 0.18) !important;
}
.rocket-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>
