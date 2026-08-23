<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import RocketCard from '../components/RocketCard.vue'
import { addLocalRocket, error, fetchRockets, loading, rockets } from '../composables/useRockets'

const searchTerm = ref('')
const showAddForm = ref(false)
const formData = ref({ full_name: '', description: '' })

onMounted(() => {
  if (rockets.value.length === 0) {
    fetchRockets()
  }
})

const filteredRockets = computed(() => {
  return rockets.value.filter(r => 
    r.full_name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handleAddRocket = () => {
  if (!formData.value.full_name) return
  addLocalRocket({
    full_name: formData.value.full_name,
    description: formData.value.description,
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    manufacturer: { country_code: null }
  })
  formData.value = { full_name: '', description: '' }
  showAddForm.value = false
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8 font-sans">
    <h1 class="text-3xl font-bold mb-8 text-slate-900">🚀 SpaceX Explorer</h1>
    
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center mb-8">
      <p class="mb-4">{{ error }}</p>
      <button @click="fetchRockets" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
        Retry Fetching
      </button>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <input v-model="searchTerm" type="text" placeholder="Filter rockets by name..." class="w-full md:w-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
      <button @click="showAddForm = !showAddForm" class="w-full md:w-auto bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition">
        {{ showAddForm ? 'Cancel' : '+ Add Custom Rocket' }}
      </button>
    </div>

    <form v-if="showAddForm" @submit.prevent="handleAddRocket" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 class="text-lg font-bold mb-4">Add Local Rocket</h3>
      <div class="grid gap-4">
        <input v-model="formData.full_name" type="text" placeholder="Rocket Name *" required class="p-2 border rounded" />
        <textarea v-model="formData.description" placeholder="Description" rows="3" class="p-2 border rounded"></textarea>
        <button type="submit" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Rocket</button>
      </div>
    </form>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>

    <div v-else-if="filteredRockets.length === 0" class="text-center text-gray-500 py-12">
      No rockets found matching "{{ searchTerm }}"
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RocketCard v-for="rocket in filteredRockets" :key="rocket.id" :rocket="rocket" />
    </div>
  </div>
</template>