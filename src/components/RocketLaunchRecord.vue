<template>
  <DetailSection
    index="02"
    title="Flight record"
    subtitle="Launches & booster landings"
  >
    <div
      v-if="groups.length"
      class="grid gap-10 lg:grid-cols-2"
    >
      <div
        v-for="group in groups"
        :key="group.title"
      >
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="data-label">
              {{ group.title }} · success rate
            </p>
            <p class="mt-1 font-mono text-4xl text-white">
              <template v-if="group.rate !== null">
                {{ group.rate }}<span class="text-xl text-slate-500">%</span>
              </template>
              <span
                v-else
                class="text-base italic text-slate-600"
              >No attempts yet</span>
            </p>
          </div>
          <p class="font-mono text-xs text-slate-500">
            {{ group.ratio }}
          </p>
        </div>

        <div
          class="mt-4 h-1 overflow-hidden bg-space-700"
          role="progressbar"
          :aria-label="`${group.title} success rate`"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="group.rate ?? 0"
        >
          <div
            class="h-full bg-flare-500"
            :style="{ width: `${group.rate ?? 0}%` }"
          />
        </div>

        <dl class="mt-4">
          <DataRow
            v-for="item in group.items"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </dl>
      </div>
    </div>
    <p
      v-else
      class="text-sm italic text-slate-500"
    >
      No flight record yet. This vehicle hasn't flown on record.
    </p>
  </DetailSection>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatNumber, getSuccessRate } from '@/utils/format'
  import type { RocketStats } from '@/types/rocket'

  const props = defineProps<{ stats: RocketStats | null }>()

  const groups = computed(() => {
    const { stats } = props
    if (!stats) return []
    const completedLaunches = stats.successfulLaunches + stats.failedLaunches
    return [
      {
        title: 'Launches',
        rate: getSuccessRate(stats.successfulLaunches, completedLaunches),
        ratio: `${stats.successfulLaunches} / ${completedLaunches}`,
        items: [
          { label: 'Total launches', value: formatNumber(stats.totalLaunches) },
          { label: 'Successful', value: formatNumber(stats.successfulLaunches) },
          { label: 'Failed', value: formatNumber(stats.failedLaunches) },
          { label: 'Upcoming', value: formatNumber(stats.pendingLaunches) },
          { label: 'Current success streak', value: formatNumber(stats.consecutiveSuccessfulLaunches) },
        ],
      },
      {
        title: 'Landings',
        rate: getSuccessRate(stats.successfulLandings, stats.attemptedLandings),
        ratio: `${stats.successfulLandings} / ${stats.attemptedLandings}`,
        items: [
          { label: 'Attempted', value: formatNumber(stats.attemptedLandings) },
          { label: 'Successful', value: formatNumber(stats.successfulLandings) },
          { label: 'Failed', value: formatNumber(stats.failedLandings) },
          { label: 'Current success streak', value: formatNumber(stats.consecutiveSuccessfulLandings) },
        ],
      },
    ]
  })
</script>
