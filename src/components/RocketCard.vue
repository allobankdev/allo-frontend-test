<template>
  <v-card
    class="d-flex flex-column flex-grow-1"
    @click="$emit('click')"
  >
    <v-img
      v-if="rocket.image_url && !imgError"
      :src="rocket.image_url"
      height="160"
      cover
      @error="imgError = true"
    />
    <div
      v-else
      class="d-flex align-center justify-center bg-surface-variant"
      style="height: 160px"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
      />
    </div>

    <v-card-title>{{ rocket.full_name }}</v-card-title>

    <v-card-text class="pb-4">
      <div class="d-flex flex-nowrap text-no-wrap overflow-hidden ga-3 text-caption text-medium-emphasis mb-2">
        <span class="d-flex align-center ga-1">
          <v-icon
            icon="mdi-circle"
            size="10"
            :color="rocket.active ? 'success' : 'grey'"
          />
          {{ rocket.active ? "Active" : "Retired" }}
        </span>
        <span
          v-if="rocket.manufacturer?.country_code"
          class="d-flex align-center ga-1"
        >
          <v-icon
            icon="mdi-earth"
            size="14"
          />
          {{ rocket.manufacturer.country_code }}
        </span>
        <span
          v-if="launchCost"
          class="d-flex align-center ga-1"
        >
          <v-icon
            icon="mdi-currency-usd"
            size="14"
          />
          {{ launchCost }}
        </span>
        <span
          v-if="maidenFlight"
          class="d-flex align-center ga-1"
        >
          <v-icon
            icon="mdi-calendar"
            size="14"
          />
          {{ maidenFlight }}
        </span>
      </div>

      <p class="description">
        {{ rocket.description || "No description available." }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { formatCurrency, formatDate } from "@/lib/utils/helper";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{ rocket: Rocket }>();
defineEmits<{ click: [] }>();

const imgError = ref(false);

const launchCost = computed(() => formatCurrency(props.rocket.launch_cost));
const maidenFlight = computed(() => formatDate(props.rocket.maiden_flight));
</script>

<style scoped>
.description {
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
