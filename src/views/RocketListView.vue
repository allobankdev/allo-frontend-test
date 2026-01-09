<template>
  <div class="rocket-list-view">
    <header class="page-header">
      <h1>🚀 SpaceX Rocket Explorer</h1>
      <p>Explore the amazing fleet of SpaceX rockets</p>
    </header>

    <div class="controls">
      <RocketFilter @filter="handleFilter" />
      <BaseButton variant="primary" @click="showAddForm = !showAddForm">
        {{ showAddForm ? 'Cancel' : 'Add New Rocket' }}
      </BaseButton>
    </div>

    <AddRocketForm
      v-if="showAddForm"
      @submit="handleAddRocket"
      @cancel="showAddForm = false"
    />

    <LoadingState v-if="store.loading" message="Loading rockets..." />

    <ErrorState
      v-else-if="store.hasError"
      :message="store.error"
      @retry="handleRetry"
    />

    <div v-else-if="store.hasRockets" class="rocket-grid">
      <RocketCard
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>

    <div v-else class="empty-state">
      <p>No rockets found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/rockets/RocketCard.vue'
import RocketFilter from '@/components/rockets/RocketFilter.vue'
import AddRocketForm from '@/components/rockets/AddRocketForm.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const store = useRocketStore()
const showAddForm = ref(false)

onMounted(() => {
  store.fetchRockets()
})

const handleFilter = (filterValue) => {
  store.setFilter(filterValue)
}

const handleAddRocket = (rocketData) => {
  store.addRocket(rocketData)
  showAddForm.value = false
}

const handleRetry = () => {
  store.retryFetch()
}
</script>

<style scoped>
.rocket-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.controls {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
}

.rocket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}
</style>
