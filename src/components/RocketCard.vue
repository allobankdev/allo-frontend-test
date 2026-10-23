<template>
  <RouterLink
    class="rocket-link"
    :to="`/rockets/${encodeURIComponent(rocket.id)}`"
  >
    <article class="rocket-card">
      <div class="rocket-image">
        <img
          v-if="rocket.imageUrl"
          :src="rocket.imageUrl"
          :alt="rocket.name"
          loading="lazy"
        >
        <div
          v-else
          class="image-fallback"
        >
          <v-icon icon="mdi-rocket-launch-outline" />
          <span>IMAGE NOT AVAILABLE</span>
        </div>
        <span class="card-index">{{ String(indexLabel).padStart(2, '0') }}</span>
        <span
          v-if="rocket.isLocal"
          class="local-badge"
        >ADDED</span>
      </div>
      <div class="card-content">
        <div class="card-title-row">
          <h3>{{ rocket.name }}</h3>
          <v-icon
            class="card-arrow"
            icon="mdi-arrow-top-right"
            size="18"
          />
        </div>
        <p>{{ rocket.description || 'No description is available for this vehicle yet.' }}</p>
        <div class="card-rule" />
        <div class="card-meta">
          <span><v-icon
            icon="mdi-map-marker-outline"
            size="14"
          /> {{ rocket.country || 'COUNTRY N/A' }}</span>
          <span>{{ rocket.maidenFlight || 'FLIGHT DATE N/A' }}</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Rocket } from '@/stores/rockets'

  const props = defineProps<{ rocket: Rocket }>()
  const indexLabel = computed(() => props.rocket.id.startsWith('local-') ? 'NEW' : props.rocket.id)
</script>

<style scoped>
  .rocket-link { color: inherit; text-decoration: none; }
  .rocket-card { height: 100%; overflow: hidden; background: #151918; border: 1px solid #ffffff12; border-radius: 8px; transition: transform .2s ease, border-color .2s ease, background .2s ease; animation: card-in .4s both; animation-delay: calc(var(--card-index, 0) * 45ms); }
  .rocket-link:hover .rocket-card { transform: translateY(-4px); border-color: #c5ff6b75; background: #191e1b; }
  .rocket-image { height: 195px; position: relative; overflow: hidden; background: radial-gradient(ellipse at 50% 110%, #baff5422, transparent 65%), #101312; }
  .rocket-image img { width: 100%; height: 100%; object-fit: cover; opacity: .82; transition: transform .4s ease, opacity .3s ease; }
  .rocket-link:hover .rocket-image img { transform: scale(1.04); opacity: 1; }
  .image-fallback { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; color: #7e8982; }
  .image-fallback .v-icon { color: #c5ff6b; font-size: 38px; }
  .image-fallback span, .card-index, .local-badge { font-family: monospace; font-size: 9px; letter-spacing: .12em; }
  .card-index { position: absolute; top: 13px; left: 14px; padding: 5px 7px; color: #e9ece8; background: #101312b8; border-radius: 3px; }
  .local-badge { position: absolute; right: 12px; top: 12px; padding: 5px 7px; color: #11150e; background: #c5ff6b; border-radius: 3px; }
  .card-content { padding: 17px 17px 15px; }
  .card-title-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  h3 { margin: 0; color: #f1f1ed; font-size: 16px; font-weight: 500; letter-spacing: -.02em; }
  .card-arrow { flex: none; color: #7e8982; transition: color .2s, transform .2s; }
  .rocket-link:hover .card-arrow { transform: translate(2px, -2px); color: #c5ff6b; }
  .card-content p { height: 42px; margin: 10px 0 15px; overflow: hidden; display: -webkit-box; color: #999f9c; font-size: 11px; line-height: 1.65; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .card-rule { height: 1px; background: #ffffff12; }
  .card-meta { display: flex; justify-content: space-between; align-items: center; gap: 7px; margin-top: 13px; color: #7f8882; font-family: monospace; font-size: 8px; letter-spacing: .08em; }
  .card-meta span:first-child { display: inline-flex; align-items: center; gap: 4px; }
  .card-meta .v-icon { color: #c5ff6b; }
  @keyframes card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .rocket-card { animation: none; transition: none; } }
</style>
