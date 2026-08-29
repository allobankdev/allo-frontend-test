<template>
  <div class="rocket-list-page">
    <div class="container">
      <!-- Success Toast -->
      <Transition name="toast">
        <div v-if="showSuccessToast" class="success-toast">
          <span class="toast-icon">✓</span>
          <span class="toast-message">Rocket added successfully!</span>
        </div>
      </Transition>

      <!-- Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">SpaceX Rockets</h1>
          <p class="page-subtitle">Explore SpaceX's rocket fleet</p>
        </div>
        <button @click="openAddForm" class="btn-add">
          <span class="btn-icon">+</span>
          Add Rocket
        </button>
      </header>

      <!-- Filter -->
      <RocketFilter :filters="rocketStore.filters" @update:filters="handleFilterUpdate" />

      <!-- Results Count -->
      <div class="results-info">
        <p v-if="rocketStore.loading" class="results-count">
          Loading rockets...
        </p>
        <p v-else class="results-count">
          Showing {{ rocketStore.filteredRockets.length }}
          {{ rocketStore.filteredRockets.length === 1 ? 'rocket' : 'rockets' }}
        </p>
      </div>


      <!-- Loading State -->
      <LoadingSpinner v-if="rocketStore.loading" :count="6" />

      <!-- Error State -->
      <ErrorState v-else-if="rocketStore.error" :message="rocketStore.error" @retry="rocketStore.fetchRockets()" />

      <!-- Content -->
      <template v-else>
        <!-- Empty State -->
        <div v-if="rocketStore.filteredRockets.length === 0" class="empty-state">
          <div class="empty-icon">🚀</div>
          <h3>No rockets found</h3>
          <p>Try adjusting your filters or add a new rocket</p>
        </div>

        <!-- Rocket Grid -->
        <div v-else class="rocket-grid">
          <RocketCard v-for="rocket in rocketStore.filteredRockets" :key="rocket.id" :rocket="rocket" />
        </div>
      </template>

      <!-- Add Rocket Form Modal -->
      <RocketForm :is-open="isFormOpen" @close="closeAddForm" @submit="handleAddRocket" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket, FilterState } from '@/types/rocket'

const rocketStore = useRocketStore()
const isFormOpen = ref(false)
const showSuccessToast = ref(false)

onMounted(() => {
  rocketStore.fetchRockets()
})

const handleFilterUpdate = (filters: FilterState) => {
  rocketStore.setFilter(filters)
}

const openAddForm = () => {
  isFormOpen.value = true
}

const closeAddForm = () => {
  isFormOpen.value = false
}

const handleAddRocket = (rocket: Omit<Rocket, 'id'>) => {
  rocketStore.addRocket(rocket)

  // Show success toast
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}
</script>

<style scoped>
.rocket-list-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

/* Success Toast */
.success-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 500;
}

.toast-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.toast-message {
  font-size: 0.875rem;
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.btn-add:hover {
  background-color: #2563eb;
}

.btn-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.results-info {
  margin-bottom: 1.5rem;
}

.results-count {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.rocket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 2rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .rocket-grid {
    grid-template-columns: 1fr;
  }
}
</style>