<template>
  <v-container class="py-6">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      :to="{ name: '/rockets/' }"
      variant="text"
    >
      All rockets
    </v-btn>

    <LoadingState
      v-if="detailStatus === 'loading' || detailStatus === 'idle'"
      message="Loading rocket…"
    />

    <ErrorState
      v-else-if="detailNotFound"
      icon="mdi-rocket-launch-outline"
      icon-color="medium-emphasis"
      message="It may have been removed, or the link is incorrect."
      :retryable="false"
      title="Rocket not found"
    >
      <template #actions>
        <v-btn
          color="primary"
          :to="{ name: '/rockets/' }"
          variant="flat"
        >
          Back to rockets
        </v-btn>
      </template>
    </ErrorState>

    <ErrorState
      v-else-if="detailStatus === 'error' || !rocket"
      :message="detailError"
      title="Couldn't load this rocket"
      @retry="rocketStore.loadRocket(route.params.id, { force: true })"
    />

    <v-row v-else>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <RocketImage
            :alt="rocket.name"
            :aspect-ratio="4 / 3"
            :src="rocket.imageUrl"
          />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <div class="d-flex flex-wrap ga-2 mb-3">
          <RocketStatusChip :active="rocket.active" />
          <v-chip
            v-if="rocket.isCustom"
            color="secondary"
            label
            size="small"
            variant="tonal"
          >
            Added by you
          </v-chip>
        </div>

        <h1 class="text-h4 mb-4">
          {{ rocket.name }}
        </h1>

        <p
          v-if="rocket.description"
          class="text-body-1 mb-6"
        >
          {{ rocket.description }}
        </p>
        <p
          v-else
          class="text-body-1 text-disabled font-italic mb-6"
        >
          No description available.
        </p>

        <v-card variant="tonal">
          <v-card-text class="d-flex flex-column ga-4">
            <InfoRow
              icon="mdi-cash"
              label="Cost per launch"
              :value="formatCurrency(rocket.launchCost)"
            />
            <InfoRow
              icon="mdi-flag-outline"
              label="Country"
              :value="formatCountry(rocket.countryCode)"
            />
            <InfoRow
              icon="mdi-calendar"
              label="First flight"
              :value="formatDate(rocket.firstFlight)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rocket'
  import { formatCountry, formatCurrency, formatDate } from '@/utils/format'

  const route = useRoute('/rockets/[id]')
  const rocketStore = useRocketStore()
  const {
    currentRocket: rocket,
    detailError,
    detailNotFound,
    detailStatus,
  } = storeToRefs(rocketStore)

  // The same component instance is reused when navigating between rockets,
  // so react to the param instead of loading only once on mount.
  watch(
    () => route.params.id,
    id => rocketStore.loadRocket(id),
    { immediate: true },
  )
</script>
