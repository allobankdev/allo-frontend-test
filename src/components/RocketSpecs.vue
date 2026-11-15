<template>
  <DetailSection
    index="01"
    title="Specifications"
    subtitle="Dimensions & performance"
  >
    <dl
      v-if="items.length"
      class="grid gap-x-10 md:grid-cols-2"
    >
      <DataRow
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      />
    </dl>
    <p
      v-else
      class="text-sm italic text-slate-500"
    >
      No specifications on file for this vehicle.
    </p>
  </DetailSection>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatNumber } from '@/utils/format'
  import type { RocketSpecs } from '@/types/rocket'

  const props = defineProps<{ specs: RocketSpecs }>()

  function formatStages ({ minStage, maxStage }: RocketSpecs): string | null {
    if (minStage === null && maxStage === null) return null
    if (minStage === null || maxStage === null || minStage === maxStage) return String(minStage ?? maxStage)
    return `${minStage}–${maxStage}`
  }

  /** Only values the API (or the user) actually provided are shown. */
  const items = computed(() => {
    const { specs } = props
    return [
      { label: 'Height', value: formatNumber(specs.length, 'm') },
      { label: 'Diameter', value: formatNumber(specs.diameter, 'm') },
      { label: 'Launch mass', value: formatNumber(specs.launchMass, 't') },
      { label: 'Liftoff thrust', value: formatNumber(specs.thrust, 'kN') },
      { label: 'Payload to LEO', value: formatNumber(specs.leoCapacity, 'kg') },
      { label: 'Payload to GTO', value: formatNumber(specs.gtoCapacity, 'kg') },
      { label: 'Stages', value: formatStages(specs) },
      { label: 'Apogee', value: formatNumber(specs.apogee, 'km') },
      { label: 'Range', value: formatNumber(specs.vehicleRange, 'km') },
    ].filter((item): item is { label: string, value: string } => item.value !== null)
  })
</script>
