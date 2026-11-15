<template>
  <DetailSection
    index="03"
    title="Manufacturer"
  >
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div class="flex flex-col gap-5">
        <div class="flex items-center gap-4">
          <div
            v-if="manufacturer.logoUrl && !logoFailed"
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 p-2"
          >
            <img
              :src="manufacturer.logoUrl"
              :alt="`${manufacturer.name} logo`"
              class="max-h-full max-w-full object-contain"
              loading="lazy"
              @error="logoFailed = true"
            >
          </div>
          <div>
            <p class="font-display text-2xl font-semibold uppercase tracking-wide text-white">
              {{ manufacturer.name }}
            </p>
            <p
              v-if="manufacturer.abbrev || manufacturer.type"
              class="data-label mt-0.5"
            >
              {{ [manufacturer.abbrev, manufacturer.type].filter(Boolean).join(' · ') }}
            </p>
          </div>
        </div>

        <dl>
          <DataRow
            v-for="fact in facts"
            :key="fact.label"
            :label="fact.label"
            :value="fact.value"
          />
        </dl>
      </div>

      <div class="flex flex-col gap-5">
        <p
          class="text-sm leading-relaxed"
          :class="manufacturer.description ? 'text-slate-400' : 'italic text-slate-600'"
        >
          {{ manufacturer.description || 'No company profile available.' }}
        </p>
        <ExternalLinks
          :info-url="manufacturer.infoUrl"
          :wiki-url="manufacturer.wikiUrl"
        />
      </div>
    </div>
  </DetailSection>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { RocketManufacturer } from '@/types/rocket'

  const props = defineProps<{
    manufacturer: RocketManufacturer
    country: string | null
  }>()

  const logoFailed = ref(false)

  const facts = computed(() => [
    { label: 'Country', value: props.country },
    { label: 'Founded', value: props.manufacturer.foundingYear },
    { label: 'Leadership', value: props.manufacturer.administrator },
  ])
</script>
