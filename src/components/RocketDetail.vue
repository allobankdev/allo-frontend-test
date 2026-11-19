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
          :aspect-ratio="4 / 3"
          :src="rocket.imageUrl"
          cover
        >
          <template #error>
            <div class="rocket-detail__fallback">
              <v-icon
                color="primary"
                size="56"
              >
                mdi-rocket-outline
              </v-icon>
              <span class="text-body-2 mt-2">Image unavailable</span>
            </div>
          </template>
        </v-img>
        <div
          v-else
          class="rocket-detail__fallback"
        >
          <v-icon
            color="primary"
            size="56"
          >
            mdi-rocket-outline
          </v-icon>
          <span class="text-body-2 mt-2">No image</span>
        </div>
      </div>
    </v-col>

    <v-col
      cols="12"
      md="7"
    >
      <p class="text-overline text-primary mb-1">
        Rocket details
      </p>

      <div class="d-flex align-center flex-wrap ga-2 mb-4">
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-0">
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

      <section class="mb-8">
        <h2 class="text-subtitle-2 text-medium-emphasis text-uppercase mb-2">
          Description
        </h2>
        <p class="text-body-1 mb-0">
          {{ description }}
        </p>
      </section>

      <section>
        <h2 class="text-subtitle-2 text-medium-emphasis text-uppercase mb-3">
          Specs
        </h2>

        <v-row dense>
          <v-col
            v-for="item in specs"
            :key="item.label"
            cols="12"
            sm="4"
          >
            <v-sheet
              border
              class="rocket-detail__spec pa-4 h-100"
              color="surface"
              rounded="lg"
            >
              <div class="d-flex align-center ga-2 mb-2">
                <v-icon
                  color="primary"
                  size="18"
                >
                  {{ item.icon }}
                </v-icon>
                <span class="text-caption text-medium-emphasis text-uppercase">
                  {{ item.label }}
                </span>
              </div>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ item.value }}
              </p>
            </v-sheet>
          </v-col>
        </v-row>
      </section>
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

  const specs = computed(() => [
    {
      label: "Cost per launch",
      value: formatLaunchCost(props.rocket.launchCost),
      icon: "mdi-currency-usd",
    },
    {
      label: "Country",
      value: displayValue(props.rocket.countryCode),
      icon: "mdi-earth",
    },
    {
      label: "First flight",
      value: displayValue(props.rocket.maidenFlight),
      icon: "mdi-calendar",
    },
  ]);
</script>

<style scoped>
  .rocket-detail__media {
    aspect-ratio: 4 / 3;
    background:
      linear-gradient(
        160deg,
        rgba(var(--v-theme-primary), 0.08),
        rgba(var(--v-theme-surface-variant), 0.9)
      );
  }

  .rocket-detail__fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 240px;
    color: rgba(var(--v-theme-on-surface), 0.55);
  }

  .rocket-detail__spec {
    background: rgb(var(--v-theme-surface));
  }
</style>
