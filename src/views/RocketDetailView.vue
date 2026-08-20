<template>
  <main id="main-content" class="rocket-detail-view">
    <div class="rdv__container">
      <RouterLink :to="{ name: 'rocket-list' }" class="rdv__back" aria-label="Back to rockets list">
        ← Back to Rockets
      </RouterLink>

      <div
        v-if="store.detailLoading"
        class="rdv__loading"
        aria-label="Loading rocket details…"
        aria-busy="true"
      >
        <div class="rdv__skeleton-hero skeleton-block" />
        <div class="rdv__skeleton-body">
          <div class="skeleton-block rdv__skeleton-line rdv__skeleton-line--title" />
          <div class="skeleton-block rdv__skeleton-line" />
          <div class="skeleton-block rdv__skeleton-line rdv__skeleton-line--short" />
        </div>
      </div>

      <ErrorState
        v-else-if="store.detailError"
        title="Failed to load rocket"
        :message="store.detailError"
        :retrying="store.detailLoading"
        @retry="loadRocket"
      />

      <article v-else-if="rocket" class="rdv__article">
        <div class="rdv__image-wrap">
          <img :src="imageSrc" :alt="rocket.name" class="rdv__image" @error="onImageError" />
          <span v-if="rocket.isLocal" class="rdv__badge">Locally Added</span>
        </div>

        <div class="rdv__content">
          <h1 class="rdv__name">
            {{ rocket.name }}
          </h1>
          <p class="rdv__description">
            {{ description }}
          </p>

          <dl class="rdv__details">
            <div class="rdv__detail-item">
              <dt class="rdv__detail-label">Cost per Launch</dt>
              <dd class="rdv__detail-value">
                {{ launchCost }}
              </dd>
            </div>
            <div class="rdv__detail-item">
              <dt class="rdv__detail-label">Country</dt>
              <dd class="rdv__detail-value">
                {{ country }}
              </dd>
            </div>
            <div class="rdv__detail-item">
              <dt class="rdv__detail-label">First Flight</dt>
              <dd class="rdv__detail-value">
                {{ maidenFlight }}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      <EmptyState v-else title="Rocket not found" message="This rocket could not be found.">
        <RouterLink :to="{ name: 'rocket-list' }" class="rdv__back-link">
          ← Back to list
        </RouterLink>
      </EmptyState>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRocketStore } from '@/stores/rocket.store'
import { formatDescription, formatCurrency, formatDate, formatText } from '@/utils/formatters'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import placeholderSrc from '@/assets/rocket-placeholder.svg'

const props = defineProps<{ id: string }>()

const store = useRocketStore()
const imageError = ref(false)

let abortController: AbortController | null = null

async function loadRocket() {
  abortController?.abort()
  abortController = new AbortController()
  imageError.value = false
  store.clearSelectedRocket()
  await store.fetchRocketById(props.id, abortController.signal)
}

watch(
  () => props.id,
  () => {
    loadRocket()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  abortController?.abort()
  store.clearSelectedRocket()
})

const rocket = computed(() => store.selectedRocket)

const imageSrc = computed(() =>
  !imageError.value && rocket.value?.imageUrl ? rocket.value.imageUrl : placeholderSrc,
)

const description = computed(() => formatDescription(rocket.value?.description))
const launchCost = computed(() => formatCurrency(rocket.value?.launchCost))
const country = computed(() => formatText(rocket.value?.country))
const maidenFlight = computed(() => formatDate(rocket.value?.maidenFlight))

function onImageError() {
  imageError.value = true
}
</script>

<style scoped>
.rocket-detail-view {
  padding: 1.5rem 1rem 3rem;
}

.rdv__container {
  max-width: 800px;
  margin: 0 auto;
}

.rdv__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.rdv__back:hover {
  text-decoration: underline;
}

.rdv__back:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
  border-radius: 4px;
}

.rdv__loading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rdv__skeleton-hero {
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: var(--radius);
}

.rdv__skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rdv__skeleton-line {
  height: 14px;
  border-radius: 4px;
  width: 100%;
}

.rdv__skeleton-line--title {
  height: 22px;
  width: 55%;
}

.rdv__skeleton-line--short {
  width: 30%;
}

.skeleton-block {
  background: var(--surface-raised);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.rdv__article {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.rdv__image-wrap {
  position: relative;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  background: var(--bg);
}

.rdv__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rdv__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.rdv__content {
  padding: 1.5rem;
}

.rdv__name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--text);
  line-height: 1.25;
}

.rdv__description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

.rdv__details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.rdv__detail-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.875rem;
}

.rdv__detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
}

.rdv__detail-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.rdv__back-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.rdv__back-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .rdv__content {
    padding: 1rem;
  }

  .rdv__details {
    grid-template-columns: 1fr;
  }

  .rdv__name {
    font-size: 1.25rem;
  }
}
</style>
