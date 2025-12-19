<template>
  <div class="mx-auto max-w-5xl px-4 py-10">
    <div class="mb-6 flex items-center gap-3 text-sm font-semibold text-slate-500">
      <router-link
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 transition hover:border-brand-300 hover:text-brand-600"
        :to="{ name: 'rocket-list' }"
      >
        ← Back to list
      </router-link>
      <span class="text-slate-300">/</span>
      <span>Rocket detail</span>
    </div>

    <div v-if="loading" class="flex flex-col items-center gap-3 rounded-3xl bg-white p-10 shadow-sm">
      <span class="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      <p class="text-sm text-slate-500">Loading rocket details...</p>
    </div>

    <div v-else-if="error" class="rounded-3xl border border-red-100 bg-red-50 p-10 text-center">
      <p class="text-base font-semibold text-red-600">{{ error }}</p>
      <p class="mt-2 text-sm text-red-500">We could not load the rocket.</p>
      <button
        class="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        @click="fetchRocket"
      >
        Retry
      </button>
    </div>

    <div v-else-if="rocket" class="space-y-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Rocket</p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ rocket.name }}</h1>
          <p class="mt-4 text-sm text-slate-600">{{ rocket.description }}</p>
        </div>
        <div class="rounded-3xl bg-slate-50 p-6">
          <dl class="grid gap-4 text-sm text-slate-600">
            <div class="flex items-center justify-between gap-4">
              <dt class="font-semibold text-slate-500">Cost per launch</dt>
              <dd class="font-semibold text-slate-900">{{ formatCurrency(rocket.cost_per_launch) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-semibold text-slate-500">Country</dt>
              <dd class="text-slate-900">{{ rocket.country }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-semibold text-slate-500">First flight</dt>
              <dd class="text-slate-900">{{ rocket.first_flight }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-semibold text-slate-500">Success rate</dt>
              <dd class="text-slate-900">{{ rocket.success_rate_pct ?? 0 }}%</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="image in heroImages"
          :key="image"
          class="overflow-hidden rounded-3xl border border-slate-100 bg-slate-100"
        >
          <img :src="image" :alt="rocket.name" class="h-72 w-full object-cover" />
        </div>
      </div>

      <div class="grid gap-4 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Engines</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">
            {{ rocket.engines?.number ?? 'N/A' }} × {{ rocket.engines?.type ?? '' }}
          </p>
          <p class="text-xs text-slate-500">Max thrust {{ rocket.engines?.thrust_vacuum?.kN ?? 0 }} kN</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">First stage</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">
            {{ rocket.first_stage?.reusable ? 'Reusable' : 'Expendable' }}
          </p>
          <p class="text-xs text-slate-500">
            Engines: {{ rocket.first_stage?.engines ?? 'N/A' }}, fuel: {{ rocket.first_stage?.fuel_amount_tons ?? 'N/A' }}
            tons
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Second stage</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">
            {{ rocket.second_stage?.engines ?? 'N/A' }} engine(s)
          </p>
          <p class="text-xs text-slate-500">
            Burn time {{ rocket.second_stage?.burn_time_sec ?? 'N/A' }} sec
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'

interface RocketDetail {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  success_rate_pct?: number
  engines?: {
    number?: number
    type?: string
    thrust_vacuum?: { kN?: number }
  }
  first_stage?: {
    reusable?: boolean
    engines?: number
    fuel_amount_tons?: number
  }
  second_stage?: {
    engines?: number
    burn_time_sec?: number
  }
}

const props = defineProps<{ id: string }>()

const rocket = ref<RocketDetail | null>(null)
const loading = ref(false)
const error = ref('')

const heroImages = computed(() => {
  if (!rocket.value?.flickr_images?.length) {
    return ['https://images2.imgbox.com/94/f2/vhZB6THP_o.png']
  }
  return rocket.value.flickr_images.slice(0, 2)
})

const formatCurrency = (value?: number) => {
  if (!value && value !== 0) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

const fetchRocket = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/rockets/${props.id}`)
    if (!response.ok) {
      throw new Error('Unable to load rocket details. Please try again.')
    }
    rocket.value = (await response.json()) as RocketDetail
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRocket)
watch(
  () => props.id,
  (next, prev) => {
    if (next !== prev) {
      fetchRocket()
    }
  },
)
</script>

