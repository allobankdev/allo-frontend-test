<template>
  <v-row>
    <v-col
      cols="12"
      md="5"
    >
      <div class="rocket-detail__media rounded-lg overflow-hidden">
        <v-img
          v-if="rocket.imageUrl"
          :alt="rocket.fullName"
          :src="rocket.imageUrl"
          cover
          max-height="360"
          min-height="240"
        >
          <template #error>
            <div class="rocket-detail__fallback">
              <v-icon size="64">
                mdi-rocket-outline
              </v-icon>
            </div>
          </template>
        </v-img>
        <div
          v-else
          class="rocket-detail__fallback"
        >
          <v-icon size="64">
            mdi-rocket-outline
          </v-icon>
        </div>
      </div>
    </v-col>

    <v-col
      cols="12"
      md="7"
    >
      <div class="d-flex align-center flex-wrap ga-2 mb-2">
        <h1 class="text-h4 font-weight-bold mb-0">
          {{ rocket.fullName }}
        </h1>
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          Local
        </v-chip>
      </div>

      <p class="text-body-1 text-medium-emphasis mb-6">
        {{ description }}
      </p>

      <v-list
        bg-color="transparent"
        class="pa-0"
        lines="two"
      >
        <v-list-item
          class="px-0"
          prepend-icon="mdi-currency-usd"
          subtitle="Cost per launch"
          :title="launchCost"
        />
        <v-list-item
          class="px-0"
          prepend-icon="mdi-earth"
          subtitle="Country"
          :title="country"
        />
        <v-list-item
          class="px-0"
          prepend-icon="mdi-calendar"
          subtitle="First flight"
          :title="firstFlight"
        />
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import type { Rocket } from "@/types";
  import {
    displayDescription,
    displayValue,
    formatLaunchCost,
  } from "@/utils";

  const props = defineProps<{
    rocket: Rocket;
  }>();

  const description = computed(() => displayDescription(props.rocket.description));
  const launchCost = computed(() => formatLaunchCost(props.rocket.launchCost));
  const country = computed(() => displayValue(props.rocket.countryCode));
  const firstFlight = computed(() => displayValue(props.rocket.maidenFlight));
</script>

<style scoped>
  .rocket-detail__media {
    background: rgba(var(--v-theme-surface-variant), 0.35);
  }

  .rocket-detail__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    height: 100%;
    color: rgba(var(--v-theme-on-surface), 0.45);
  }
</style>
