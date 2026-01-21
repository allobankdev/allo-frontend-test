<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRocketStore } from '@/store/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketForm from '@/components/AddRocketForm.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'


const store = useRocketStore()
const keyword = ref('')

onMounted(() => {
  store.loadRockets() // lifecycle
})

const filteredRockets = computed(() =>
  store.rockets.filter(r =>
    r.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

const addFormRef = ref<HTMLElement | null>(null)

const goToAddForm = () => {
  addFormRef.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<template>
  <div class="page">
    <div class="controls">
      
      <div class="filter-section">
         <div class="filter-bar">
          
          <div class="filter-left">
            <RocketFilter v-model="keyword" />
          </div>

          <router-link to="/rocket/new" class="add-btn">
            ➕ Add Rocket
          </router-link>
        </div>
      </div>
      
    </div>

    <LoadingState v-if="store.loading" />

    <ErrorState
      v-else-if="store.error"
      @retry="store.loadRockets"
    />

    <div v-else-if="filteredRockets.length === 0" class="empty">
      🚀 No rockets found
    </div>

    <div v-else class="grid">
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
  </div>
</template>


<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

/* Top controls (filter + add form) */
.controls {

  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem; /* JARAK ANTAR SECTION */
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

/* Left side */
.filter-left {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.add-btn:hover {
  background: #1d4ed8;
}


/* Mobile */
@media (max-width: 640px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .add-btn {
    width: 100%;
  }
}



/* Rocket grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;                 /* 🔥 tambah jarak */
  margin-top: 1.5rem;        /* 🔥 pisahkan dari controls */
  animation: fadeIn 0.3s ease-in-out;
}

/* Empty state */
.empty {
  text-align: center;
  color: #666;
  margin-top: 3rem;
  font-size: 1rem;
}

/* Simple animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile optimization */
@media (max-width: 600px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
