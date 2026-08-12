<template>
  <v-container class="py-8 py-md-12" max-width="1200">
    <v-btn
      class="mb-6 pl-0"
      prepend-icon="mdi-arrow-left"
      style="color: var(--color-ink-soft);"
      to="/"
      variant="text"
    >
      Back to fleet
    </v-btn>

    <LoadingState v-if="store.detailStatus === 'loading'" message="Loading rocket..." />

    <ErrorState
      v-else-if="store.detailStatus === 'error'"
      :message="store.detailErrorMessage"
      @retry="store.fetchRocketDetail(rocketId)"
    />

    <v-alert v-else-if="!rocket" type="warning" variant="tonal">
      Rocket not found.
    </v-alert>

    <v-row v-else>
      <v-col cols="12" md="5">
        <v-img
          :src="rocket.image_url ?? undefined"
          height="360"
          rounded="0"
          style="border: 1px solid var(--color-rule);"
          cover
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height" style="background: #EFECE4;">
              <v-icon icon="mdi-rocket-launch-outline" size="56" style="color: var(--color-ink-soft);" />
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="7">
        <h1 class="display-heading text-h4 font-weight-medium mb-4">
          {{ rocket.full_name }}
        </h1>

        <p class="text-body-1 mb-8" style="color: var(--color-ink-soft);">
          {{ rocket.description ?? 'No description available.' }}
        </p>

        <div>
          <div class="spec-row">
            <span class="spec-row__label">Cost per launch</span>
            <span class="spec-row__value">{{ formattedCost }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-row__label">Country</span>
            <span class="spec-row__value">{{ rocket.manufacturer?.country_code ?? 'Unknown' }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-row__label">First flight</span>
            <span class="spec-row__value">{{ rocket.maiden_flight ?? 'Unknown' }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router/auto'
  import { useRocketsStore } from '@/stores/rockets'

  const route = useRoute('/rockets/[id]')
  const store = useRocketsStore()

  const rocketId = Number(route.params.id)
  const rocket = computed(() => store.getById(rocketId))

  const formattedCost = computed(() => {
    const cost = rocket.value?.launch_cost
    if (!cost) return 'Unknown'
    return `$${Number(cost).toLocaleString('en-US')}`
  })

  onMounted(() => {
    store.fetchRocketDetail(rocketId)
  })
</script>
