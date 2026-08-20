<template>
  <div class="app-page app-shell detail-page">
    <v-btn
      class="detail-page__back"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <div
      v-if="loadState.status === 'loading' || loadState.status === 'idle'"
      aria-label="Loading rocket details"
      class="detail-skeleton"
    >
      <v-skeleton-loader
        class="detail-skeleton__media"
        type="image"
      />
      <v-skeleton-loader
        class="detail-skeleton__content"
        type="heading, paragraph, paragraph, actions"
      />
    </div>

    <AppFeedback
      v-else-if="loadState.status === 'error'"
      action-icon="mdi-refresh"
      action-label="Retry"
      icon="mdi-cloud-alert-outline"
      :message="loadState.error || 'Rocket details could not be loaded.'"
      mode="error"
      title="Unable to load rocket"
      @action="load(true)"
    />

    <article
      v-else-if="rocket"
      class="rocket-detail"
    >
      <div class="rocket-detail__visual">
        <RocketImage
          :alt="name"
          class="rocket-detail__image"
          :src="rocket.image_url"
        />
        <span class="rocket-detail__record">Catalog record #{{ rocket.id }}</span>
      </div>

      <div class="rocket-detail__content">
        <div class="rocket-detail__eyebrow">
          <span>{{ familyLabel }}</span>
          <v-chip
            v-if="rocket.is_local"
            color="secondary"
            label
            size="small"
            variant="tonal"
          >
            Local entry
          </v-chip>
        </div>

        <h1>{{ name }}</h1>
        <p class="rocket-detail__description">
          {{ description }}
        </p>

        <dl class="rocket-detail__facts">
          <div>
            <dt>
              <v-icon
                icon="mdi-cash-multiple"
                size="19"
              />
              Cost per launch
            </dt>
            <dd>{{ launchCost }}</dd>
          </div>
          <div>
            <dt>
              <v-icon
                icon="mdi-map-marker-outline"
                size="19"
              />
              Country
            </dt>
            <dd>{{ country }}</dd>
          </div>
          <div>
            <dt>
              <v-icon
                icon="mdi-calendar-blank-outline"
                size="19"
              />
              First flight
            </dt>
            <dd>{{ firstFlight }}</dd>
          </div>
        </dl>
      </div>
    </article>

    <AppFeedback
      v-else
      icon="mdi-rocket-outline"
      message="This catalog entry does not contain displayable rocket data."
      title="Rocket not available"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRocketDetail } from '@/composables/useRocketDetail'
  import {
    formatCountry,
    formatFirstFlight,
    formatLaunchCost,
    getRocketDescription,
    getRocketFamily,
    getRocketName,
  } from '@/utils/rocket'

  const { rocket, loadState, load } = useRocketDetail()
  const name = computed(() => rocket.value ? getRocketName(rocket.value) : 'Rocket')
  const description = computed(() => rocket.value ? getRocketDescription(rocket.value) : '')
  const launchCost = computed(() => formatLaunchCost(rocket.value?.launch_cost ?? null))
  const country = computed(() => rocket.value ? formatCountry(rocket.value) : 'Not available')
  const firstFlight = computed(() => formatFirstFlight(rocket.value?.maiden_flight ?? null))
  const familyLabel = computed(() => {
    if (!rocket.value) return 'Launch vehicle'

    const family = getRocketFamily(rocket.value)
    return family === 'other'
      ? 'SpaceX launch vehicle'
      : `${family[0].toUpperCase()}${family.slice(1)} family`
  })
</script>
