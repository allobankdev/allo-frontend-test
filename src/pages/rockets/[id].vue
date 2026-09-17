<template>
  <section class="flex flex-col gap-6">
    <PageHeader
      :subtitle="rocket ? 'SpaceX launch vehicle detail.' : ''"
      :title="rocket ? name : 'Rocket Detail'"
    >
      <template #before>
        <router-link
          class="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
          to="/"
        >
          <i class="mdi mdi-arrow-left" />
          Back to rockets
        </router-link>
      </template>

      <RocketStatusBadges
        v-if="rocket"
        class="self-center"
        :rocket="rocket"
      />
    </PageHeader>

    <AsyncState
      :error="store.detailError"
      loading-text="Loading rocket..."
      :status="store.detailStatus"
      @retry="load"
    >
      <template v-if="rocket">
        <div class="grid gap-4 lg:grid-cols-3">
          <div class="rounded-3xl bg-white p-3 lg:col-span-2">
            <RocketImage
              :alt="name"
              class="aspect-[16/10] h-full max-h-[480px] w-full rounded-2xl"
              :src="rocket.image_url"
            />
          </div>

          <div class="card flex flex-col">
            <h2 class="text-lg font-semibold">
              Overview
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-muted">
              {{ description }}
            </p>

            <dl class="mt-auto grid grid-cols-2 gap-3 pt-6 text-sm">
              <div class="rounded-2xl bg-canvas p-3">
                <dt class="text-xs text-muted">
                  Manufacturer
                </dt>
                <dd class="mt-1 font-medium">
                  {{ rocket.manufacturer?.name || FALLBACK_TEXT }}
                </dd>
              </div>
              <div class="rounded-2xl bg-canvas p-3">
                <dt class="text-xs text-muted">
                  Source
                </dt>
                <dd class="mt-1 font-medium">
                  {{ rocket.isLocal ? 'Added by you' : 'Launch Library 2' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <StatCard
            v-for="(item, index) in details"
            :key="item.label"
            compact
            :highlighted="index === 0"
            v-bind="item"
          />
        </div>
      </template>
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
    {
      label: 'Cost per Launch',
      value: formatCost(rocket.value?.launch_cost),
      hint: 'Estimated in USD',
      icon: 'mdi-currency-usd',
    },
    {
      label: 'Country',
      value: rocket.value?.manufacturer?.country_code || FALLBACK_TEXT,
      hint: 'Manufacturer origin',
      icon: 'mdi-flag-outline',
    },
    {
      label: 'First Flight',
      value: formatDate(rocket.value?.maiden_flight),
      hint: 'Maiden launch date',
      icon: 'mdi-calendar-blank-outline',
    },
  ])

  function load () {
    store.loadRocket(rocketId.value)
  }

  onMounted(load)
  watch(rocketId, load)
</script>
