<template>
  <section class="flex flex-col gap-8">
    <nav
      class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500"
      aria-label="Breadcrumb"
    >
      <RouterLink
        to="/"
        class="-mx-1.5 -my-2 inline-flex items-center gap-1.5 rounded-sm px-1.5 py-2 text-slate-400 transition-colors hover:text-flare-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-400"
      >
        <span
          class="mdi mdi-arrow-left"
          aria-hidden="true"
        />
        Back to rockets
      </RouterLink>
      <template v-if="rocket">
        <span aria-hidden="true">/</span>
        <span class="text-slate-300">{{ formatDesignation(rocket) }}</span>
      </template>
    </nav>

    <template v-if="rocket">
      <article class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <RocketImage
            :src="rocket.imageUrl"
            :alt="rocket.name"
            class="aspect-[4/5] rounded-lg border border-space-700/80 sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </div>

        <div class="flex flex-col gap-7">
          <div>
            <p
              v-if="kicker"
              class="eyebrow"
            >
              {{ kicker }}
            </p>
            <h1 class="mt-3 font-display text-5xl font-semibold uppercase leading-[0.95] tracking-wide text-white sm:text-6xl">
              {{ rocket.name }}
            </h1>
            <p
              v-if="rocket.alias"
              class="mt-2 text-sm text-slate-500"
            >
              Also known as {{ rocket.alias }}
            </p>

            <div
              v-if="badges.length"
              class="mt-5 flex flex-wrap gap-2"
            >
              <span
                v-for="badge in badges"
                :key="badge.label"
                class="badge"
                :class="badge.class"
              >
                <span
                  v-if="badge.dot"
                  class="h-1.5 w-1.5 rounded-full"
                  :class="badge.dot"
                  aria-hidden="true"
                />
                {{ badge.label }}
              </span>
            </div>
          </div>

          <p
            class="max-w-prose leading-relaxed"
            :class="rocket.description ? 'text-slate-300' : 'italic text-slate-600'"
          >
            {{ rocket.description || 'No description available.' }}
          </p>

          <dl class="grid gap-5 border-y border-space-800 py-6 sm:grid-cols-3">
            <StatTile
              v-for="fact in keyFacts"
              :key="fact.label"
              :label="fact.label"
              :value="fact.value"
            />
          </dl>

          <div
            v-if="rocket.programs.length"
            class="flex flex-col gap-2.5"
          >
            <h2 class="data-label">
              Programs
            </h2>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="program in rocket.programs"
                :key="program"
                class="rounded-sm border border-space-700 px-2.5 py-1 text-sm text-slate-300"
              >
                {{ program }}
              </li>
            </ul>
          </div>

          <ExternalLinks
            :info-url="rocket.infoUrl"
            :wiki-url="rocket.wikiUrl"
          />
        </div>
      </article>

      <RocketSpecs :specs="rocket.specs" />
      <RocketLaunchRecord :stats="rocket.stats" />
      <RocketManufacturer
        v-if="rocket.manufacturer"
        :manufacturer="rocket.manufacturer"
        :country="rocket.country"
      />
    </template>

    <LoadingState
      v-else-if="detailStatus === 'idle' || detailStatus === 'loading'"
      label="Retrieving datasheet"
    />

    <EmptyState
      v-else-if="detailNotFound"
      code="404 · Not in registry"
      title="Rocket not found"
      description="The rocket you are looking for doesn't exist or is no longer available."
    >
      <RouterLink
        to="/"
        class="btn-primary"
      >
        Back to rockets
      </RouterLink>
    </EmptyState>

    <ErrorState
      v-else
      title="Couldn't load this rocket"
      :message="detailError"
      @retry="load"
    />
  </section>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, watch } from 'vue'
  import { useRoute } from 'vue-router/auto'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rockets'
  import { formatCurrency, formatDate, formatDesignation } from '@/utils/format'

  interface Badge {
    label: string
    class: string
    dot?: string
  }

  const route = useRoute('/rockets/[id]')
  const store = useRocketStore()
  const { detailStatus, detailError, detailNotFound } = storeToRefs(store)

  const rocketId = computed(() => route.params.id)
  /** Resolved from local rockets, the cached list, or the detail cache. */
  const rocket = computed(() => store.getRocket(rocketId.value) ?? null)

  /** Required facts are always shown, with a fallback when missing. */
  const keyFacts = computed(() => {
    if (!rocket.value) return []
    return [
      { label: 'Cost per launch', value: formatCurrency(rocket.value.launchCost) },
      { label: 'Country', value: rocket.value.country },
      { label: 'First flight', value: formatDate(rocket.value.firstFlight) },
    ]
  })

  const kicker = computed(() => {
    if (!rocket.value) return ''
    const { family, variant } = rocket.value
    return [family && `${family} family`, variant].filter(Boolean).join(' · ')
  })

  const badges = computed<Badge[]>(() => {
    if (!rocket.value) return []
    const { isLocal, active, reusable } = rocket.value
    const result: Badge[] = []
    if (active !== null) {
      result.push(active
        ? { label: 'Active', class: 'border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' }
        : { label: 'Retired', class: 'border-space-600 text-slate-400', dot: 'bg-slate-500' })
    }
    if (reusable !== null) {
      result.push({ label: reusable ? 'Reusable' : 'Expendable', class: 'border-space-600 text-slate-300' })
    }
    if (isLocal) result.push({ label: 'Added locally', class: 'border-flare-500/50 text-flare-300' })
    return result
  })

  function load (): void {
    void store.fetchRocketById(rocketId.value)
  }

  // Runs on enter and whenever the :id param changes while the page is reused.
  watch(rocketId, load, { immediate: true })

  onBeforeUnmount(() => {
    store.cancelDetailRequest()
  })
</script>
