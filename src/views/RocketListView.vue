<template>
  <main id="main-content" class="rocket-list-view">
    <div class="rlv__container">
      <div class="rlv__page-header">
        <h1 class="rlv__heading">SpaceX Rockets</h1>
        <BaseButton id="add-rocket-btn" type="button" variant="primary" @click="showModal = true">
          + Add Rocket
        </BaseButton>
      </div>

      <RocketFilter @update="onFilterUpdate" />

      <p
        v-if="!store.listLoading && !store.listError"
        class="rlv__count"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ filteredRockets.length }}
        {{ filteredRockets.length === 1 ? 'rocket' : 'rockets' }}
      </p>

      <LoadingSkeleton v-if="store.listLoading" :count="8" />

      <ErrorState
        v-else-if="store.listError"
        title="Failed to load rockets"
        :message="store.listError"
        :retrying="store.listLoading"
        @retry="retry"
      />

      <div
        v-else-if="filteredRockets.length > 0"
        class="rlv__grid"
        role="list"
        aria-label="Rocket list"
      >
        <div v-for="rocket in filteredRockets" :key="rocket.id" role="listitem">
          <RocketCard :rocket="rocket" />
        </div>
      </div>

      <EmptyState
        v-else-if="searchQuery"
        title="No rockets match your search"
        :message="`No results for &quot;${searchQuery}&quot;. Try a different term.`"
      />

      <EmptyState
        v-else
        title="No rockets available"
        message="No rockets were returned by the API."
      />
    </div>

    <RocketFormModal v-model="showModal" @closed="onModalClosed" />
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRocketStore } from '@/stores/rocket.store'
import type { Rocket } from '@/types/rocket'
import BaseButton from '@/components/BaseButton.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketCard from '@/components/RocketCard.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import RocketFormModal from '@/components/RocketFormModal.vue'

const store = useRocketStore()
const showModal = ref(false)
const searchQuery = ref('')

let abortController: AbortController | null = null

onMounted(async () => {
  if (!store.initialized) {
    abortController = new AbortController()
    await store.fetchRockets(abortController.signal)
  }
})

onBeforeUnmount(() => {
  abortController?.abort()
})

const filteredRockets = computed<Rocket[]>(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return store.rockets
  return store.rockets.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      (r.description ?? '').toLowerCase().includes(q) ||
      (r.country ?? '').toLowerCase().includes(q),
  )
})

function onFilterUpdate(query: string) {
  searchQuery.value = query
}

async function retry() {
  abortController = new AbortController()
  await store.fetchRockets(abortController.signal, true)
}

function onModalClosed() {
  document.getElementById('add-rocket-btn')?.focus()
}
</script>

<style scoped>
.rocket-list-view {
  padding: 1.5rem 1rem;
}

.rlv__container {
  max-width: var(--max-width);
  margin: 0 auto;
}

.rlv__page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.rlv__heading {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.rlv__count {
  font-size: 0.8rem;
  color: var(--text-subtle);
  margin: 0 0 0.875rem;
}

.rlv__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

@media (max-width: 480px) {
  .rocket-list-view {
    padding: 1rem 0.75rem;
  }

  .rlv__page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
