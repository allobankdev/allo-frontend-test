<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import RocketImage from '../../components/RocketImage.vue'
import RequestState from '../../components/RequestState.vue'
import { rocketStore } from '../../stores/rockets'
import type { Rocket } from '../../types/rocket'

const route = useRoute()
const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref('')
const retry = ref(0)

watch([() => String(route.params.id ?? ''), retry], async ([id], _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  rocket.value = null
  error.value = ''
  loading.value = true
  try {
    const result = await rocketStore.loadDetail(id, controller.signal)
    if (!controller.signal.aborted) rocket.value = result
  } catch (cause) {
    if (!controller.signal.aborted) {
      error.value = cause instanceof Error ? cause.message : 'Detail roket tidak dapat dimuat.'
    }
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}, { immediate: true })

function formatCost(value: string | null) {
  if (value === null || !value.trim()) return 'Belum tersedia'
  const number = Number(value)
  return Number.isFinite(number)
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number)
    : value
}

function formatDate(value: string | null) {
  if (!value) return 'Belum tersedia'
  // Date-only values are calendar dates, so formatting must not shift their day.
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long', timeZone: 'UTC',
  }).format(date)
}
</script>

<template>
  <section aria-label="Detail roket">
    <RouterLink class="back-link" to="/">← Kembali ke daftar roket</RouterLink>
    <h1 v-if="!rocket">Detail roket</h1>
    <RequestState :loading="loading" :error="error" @retry="retry++" />
    <article v-if="rocket" class="detail-layout">
      <RocketImage :src="rocket.imageUrl" :name="rocket.name" />
      <div class="detail-content">
        <p class="eyebrow">Detail roket</p>
        <h1>{{ rocket.name }}</h1>
        <p class="description">{{ rocket.description || 'Deskripsi belum tersedia.' }}</p>
        <dl class="rocket-facts">
          <div><dt>Biaya per peluncuran</dt><dd>{{ formatCost(rocket.launchCost) }}</dd></div>
          <div><dt>Negara</dt><dd>{{ rocket.country || 'Belum tersedia' }}</dd></div>
          <div><dt>Penerbangan pertama</dt><dd>{{ formatDate(rocket.firstFlight) }}</dd></div>
        </dl>
      </div>
    </article>
  </section>
</template>
