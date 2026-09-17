<template>
  <section>
    <v-btn
      class="mb-4 px-2"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <AsyncState
      :error="store.detailError"
      loading-text="Loading rocket..."
      :status="store.detailStatus"
      @retry="load"
    >
      <v-card v-if="rocket">
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <RocketImage
              :alt="name"
              :aspect-ratio="4 / 3"
              :src="rocket.image_url"
            />
          </v-col>

          <v-col
            class="d-flex flex-column"
            cols="12"
            md="6"
          >
            <div class="pa-6">
              <div class="d-flex flex-wrap align-center ga-2 mb-3">
                <h1 class="text-h5 font-weight-bold">
                  {{ name }}
                </h1>
                <v-chip v-if="rocket.isLocal">
                  New
                </v-chip>
                <v-chip v-if="rocket.active !== undefined">
                  {{ rocket.active ? 'Active' : 'Retired' }}
                </v-chip>
              </div>
              <p class="text-body-1 text-medium-emphasis">
                {{ description }}
              </p>
            </div>

            <v-divider />

            <div class="details">
              <DetailItem
                v-for="item in details"
                :key="item.label"
                v-bind="item"
              />
            </div>
          </v-col>
        </v-row>
      </v-card>
    </AsyncState>
  </section>
</template>

<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/stores/rockets'
  import {
    FALLBACK_TEXT,
    formatCost,
    formatDate,
    getRocketDescription,
    getRocketName,
  } from '@/utils/rocket'

  const route = useRoute('/rockets/[id]')
  const store = useRocketStore()

  const rocketId = computed(() => Number(route.params.id))
  const rocket = computed(() => store.selectedRocket)
  const name = computed(() => (rocket.value ? getRocketName(rocket.value) : ''))
  const description = computed(() => (rocket.value ? getRocketDescription(rocket.value) : ''))

  const details = computed(() => [
    { icon: 'mdi-currency-usd', label: 'Cost per launch', value: formatCost(rocket.value?.launch_cost) },
    { icon: 'mdi-flag-outline', label: 'Country', value: rocket.value?.manufacturer?.country_code || FALLBACK_TEXT },
    { icon: 'mdi-calendar-blank-outline', label: 'First flight', value: formatDate(rocket.value?.maiden_flight) },
  ])

  function load () {
    store.loadRocket(rocketId.value)
  }

  onMounted(load)
  watch(rocketId, load)
</script>

<style scoped>
.details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
</style>
