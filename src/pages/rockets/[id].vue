<template>
  <main class="detail-page">
    <header class="topbar"><RouterLink to="/" class="brand"><span class="brand-mark"><v-icon icon="mdi-rocket-launch" size="18" /></span><span>ALLO<span class="brand-light"> / FLIGHT DECK</span></span></RouterLink><span class="topbar-note"><span class="status-dot" /> SPACE X CONFIGURATIONS</span></header>
    <div class="detail-content"><RouterLink class="back-link" to="/"><v-icon icon="mdi-arrow-left" size="17" /> BACK TO THE FLEET</RouterLink>
      <div v-if="loading" class="state-panel"><v-progress-circular indeterminate color="grey-darken-2" size="28" /><span>Loading vehicle profile...</span></div>
      <div v-else-if="error" class="state-panel error-state"><v-icon icon="mdi-alert-circle-outline" size="30" /><strong>We couldn't load this vehicle.</strong><span>{{ error }}</span><button class="submit-button" @click="load">TRY AGAIN <v-icon icon="mdi-refresh" size="16" /></button></div>
      <article v-else-if="rocket" class="profile"><div class="profile-image"><img v-if="rocket.image_url && !imageFailed" :src="rocket.image_url" :alt="rocket.full_name || 'Rocket'" @error="imageFailed = true" /><img v-else class="fallback-image" src="/rocket-placeholder.svg" alt="Illustrated rocket placeholder; photo unavailable" /><span class="image-caption">SPACE X · VEHICLE PROFILE</span></div><div class="profile-info"><div class="eyebrow dark"><span>CONFIGURATION</span><span class="eyebrow-rule" /> {{ String(rocket.id).startsWith('local-') ? 'LOCAL ENTRY' : 'LL2 / SPACEX' }}</div><h1>{{ rocket.full_name || 'Unnamed rocket' }}<span class="period">.</span></h1><p class="description">{{ rocket.description || 'No description is available for this vehicle.' }}</p><div class="specs"><div><span>01 / LAUNCH COST</span><strong>{{ cost }}</strong></div><div><span>02 / COUNTRY</span><strong>{{ country }}</strong></div><div><span>03 / FIRST FLIGHT</span><strong>{{ firstFlight }}</strong></div></div><RouterLink to="/" class="fleet-link">EXPLORE THE FLEET <v-icon icon="mdi-arrow-right" size="16" /></RouterLink></div></article>
    </div>
    <footer class="page-footer"><span>ALL SYSTEMS NOMINAL <i class="status-dot" /></span><span>DATA PROVIDED BY THE SPACE DEVS · LL2 API</span></footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'
const route = useRoute()
const { getRocket } = useRockets()
const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref('')
const imageFailed = ref(false)
const cost = computed(() => {
  const value = rocket.value?.launch_cost
  if (value == null || value === '') return 'Not available'
  const amount = Number(value)
  return Number.isFinite(amount) ? `$${amount.toLocaleString()}` : String(value)
})
const country = computed(() => rocket.value?.manufacturer?.country_code || 'Not available')
const firstFlight = computed(() => {
  if (!rocket.value?.maiden_flight) return 'Not available'
  const date = new Date(rocket.value.maiden_flight)
  return Number.isNaN(date.getTime()) ? rocket.value.maiden_flight : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
})
async function load(id = String(route.params.id)) {
  loading.value = true; error.value = ''; imageFailed.value = false
  try { rocket.value = await getRocket(id) } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Please try again.' } finally { loading.value = false }
}
watch(() => route.params.id, id => load(String(id)), { immediate: true })
</script>

<style scoped>
.detail-page{min-height:100vh;background:#f7f7f3}.detail-content{max-width:1100px;margin:0 auto;padding:48px 35px 25px}.back-link{display:inline-flex;align-items:center;gap:8px;color:#74756c;text-decoration:none;font:10px 'DM Mono',monospace;letter-spacing:.1em}.back-link:hover{color:#1f201c}.profile{display:grid;grid-template-columns:1.05fr .95fr;gap:58px;margin-top:41px;align-items:center}.profile-image{height:560px;background:#e9e9e2;position:relative;overflow:hidden;border-radius:5px}.profile-image img{width:100%;height:100%;display:block;object-fit:cover}.image-placeholder{height:100%;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;color:#77776e;font:10px 'DM Mono',monospace;letter-spacing:.1em}.image-caption{position:absolute;bottom:16px;left:16px;padding:8px 10px;background:#ffffffd9;font:9px 'DM Mono',monospace;letter-spacing:.09em}.profile-info h1{font-size:clamp(36px,5vw,60px);line-height:1.05;letter-spacing:-.065em;font-weight:600;margin-top:25px}.period{color:#8ab832}.description{font-size:14px;color:#66675f;line-height:1.9;margin-top:20px}.specs{border-top:1px solid #ddded7;margin-top:35px}.specs>div{display:flex;justify-content:space-between;gap:15px;padding:17px 0;border-bottom:1px solid #ddded7;align-items:center}.specs span{font:9px 'DM Mono',monospace;letter-spacing:.08em;color:#85867d}.specs strong{font-size:13px;text-align:right;font-weight:600}.fleet-link{margin-top:29px;display:inline-flex;align-items:center;gap:10px;color:#252621;text-decoration:none;font:10px 'DM Mono',monospace;letter-spacing:.08em;border-bottom:1px solid #b8bbac;padding-bottom:8px}.fleet-link:hover{border-color:#86b634}.state-panel{min-height:380px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#77776e;font-size:13px}.state-panel strong{color:#20211e;font-size:16px}.error-state .submit-button{margin-top:5px}.submit-button{border:0;background:#252621;color:white;padding:12px 14px;border-radius:3px;font:10px 'DM Mono',monospace;display:flex;align-items:center;gap:8px;cursor:pointer;justify-content:center}.page-footer{max-width:1030px;margin:30px auto 0;padding:16px 0;border-top:1px solid #deded8;display:flex;justify-content:space-between;color:#85867d;font:9px 'DM Mono',monospace;letter-spacing:.1em}.page-footer .status-dot{display:inline-block;margin-left:6px;width:6px;height:6px;border-radius:50%;background:#b6f14e}@media(max-width:760px){.detail-content{padding:32px 22px}.profile{grid-template-columns:1fr;gap:30px;margin-top:28px}.profile-image{height:360px}.profile-info h1{font-size:43px}.page-footer{margin:30px 22px 0}}@media(max-width:480px){.profile-image{height:280px}.specs>div{align-items:flex-start;flex-direction:column;gap:8px}.specs strong{text-align:left}.page-footer{font-size:8px;gap:10px;flex-wrap:wrap;row-gap:8px}.topbar-note{display:none}}
</style>
