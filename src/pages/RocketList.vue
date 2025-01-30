<template>
  <div style="margin: 50px;">
    <h1>Rocket List</h1>
    
    <!-- search input -->
    <div>
      <label style="margin-right: 20px;" for="search">Search Rockets:</label>
      <input
        type="text"
        id="search"
        v-model="searchQuery"
        placeholder="Search by name or description"
      />
    </div>

    <!-- filter input -->
    <div>
      <label for="massFilter">Filter by Mass (kg):</label>
      <input
        type="number"
        id="massFilter"
        v-model="massFilter"
        :min="0"
        :max="1000000"
        placeholder="Filter by mass"
      />
    </div>

    <div v-if="loading">Loading rockets...</div>
    
    <div v-else-if="error">
      <p>Error loading rockets: {{ error }}</p>
      <button @click="fetchRockets">Retry</button>
    </div>
    
    <div v-else>
      <ul>
        <li v-for="rocket in filteredRockets" :key="rocket.id" @click="goToDetail(rocket.id)">
          <img :src="rocket.flickr_images[0]" alt="Rocket Image" width="200" />
          <h2>{{ rocket.name }}</h2>
          <p>{{ rocket.description }}</p>
        </li>
      </ul>
    </div>

  


    <!-- Add Rocket Form -->
    <div class="add-rocket">
      <h2>Add New Rocket</h2>
      <form @submit.prevent="addRocket" class="rocket-form">
        <div class="form-group">
          <label for="name">Rocket Name:</label>
          <input type="text" id="name" v-model="newRocket.name" required />
        </div>
        <div class="form-group">
          <label for="description">Rocket Description:</label>
          <textarea id="description" v-model="newRocket.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="image">Image URL:</label>
          <input type="text" id="image" v-model="newRocket.image" required />
        </div>
        <div class="form-group">
          <label for="height">Height (meters):</label>
          <input type="number" id="height" v-model="newRocket.height.meters" required />
        </div>
        <div class="form-group">
          <label for="diameter">Diameter (meters):</label>
          <input type="number" id="diameter" v-model="newRocket.diameter.meters" required />
        </div>
        <div class="form-group">
          <label for="mass">Mass (kg):</label>
          <input type="number" id="mass" v-model="newRocket.mass.kg" required />
        </div>
        <div class="form-group">
          <label for="thrust">First Stage Thrust (kN):</label>
          <input type="number" id="thrust" v-model="newRocket.first_stage.thrust_sea_level.kN" required />
        </div>
        <div class="form-group">
          <label for="payload">Payload Weight (kg):</label>
          <input type="number" id="payload" v-model="newRocket.payload_weights[0].kg" required />
        </div>
        <button type="submit" class="btn-add">Add Rocket</button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

const router = useRouter()
const rockets = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('') 
const massFilter = ref(null)
const newRocket = ref({
  name: '',
  description: '',
  image: '',
  height: { meters: null, feet: null },
  diameter: { meters: null, feet: null },
  mass: { kg: null, lb: null },
  first_stage: { thrust_sea_level: { kN: null, lbf: null } },
  second_stage: { thrust: { kN: null, lbf: null }, payloads: { composite_fairing: {} } },
  payload_weights: [{ id: 'leo', kg: null, lb: null }],
  flickr_images: [],
})

const fetchRockets = async () => {
  loading.value = true
  error.value = null
  
  const storedRockets = localStorage.getItem('rockets')
  
  if (storedRockets) {
    rockets.value = JSON.parse(storedRockets)
    loading.value = false
  } else {
    try {
      const response = await fetch("https://api.spacexdata.com/v4/rockets")
      const data = await response.json()
      rockets.value = data
      localStorage.setItem('rockets', JSON.stringify(data))
    } catch (err) {
      error.value = 'Failed to fetch rockets. Please try again.'
    } finally {
      loading.value = false
    }
  }
}

const filteredRockets = computed(() => {
  return rockets.value.filter((rocket) => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch =
      rocket.name.toLowerCase().includes(query) ||
      rocket.description.toLowerCase().includes(query)
    
    const matchesMass = massFilter.value
      ? rocket.mass.kg >= massFilter.value
      : true 
    
    return matchesSearch && matchesMass
  })
})

onMounted(() => {
  fetchRockets()
})

const goToDetail = (id) => {
  router.push(`/rockets/${id}`)
}

const addRocket = () => {
  const newId = rockets.value.length + 1
  const newR = {
    id: String(newId),
    name: newRocket.value.name,
    description: newRocket.value.description,
    flickr_images: [newRocket.value.image],
    height: newRocket.value.height,
    diameter: newRocket.value.diameter,
    mass: newRocket.value.mass,
    first_stage: newRocket.value.first_stage,
    second_stage: newRocket.value.second_stage,
    payload_weights: newRocket.value.payload_weights,
  }
  rockets.value.push(newR)

  localStorage.setItem('rockets', JSON.stringify(rockets.value))

  newRocket.value.name = ''
  newRocket.value.description = ''
  newRocket.value.image = ''
  newRocket.value.height = { meters: null, feet: null }
  newRocket.value.diameter = { meters: null, feet: null }
  newRocket.value.mass = { kg: null, lb: null }
  newRocket.value.first_stage.thrust_sea_level = { kN: null, lbf: null }
  newRocket.value.payload_weights[0].kg = null
}
</script>

<style>

input#search, #massFilter {
  margin: 20px ;
  padding: 12px 16px; 
  width: 100%;
  max-width: 500px; 
  border: 1px solid #ccc;
  border-radius: 8px;  
  font-size: 16px;
  transition: all 0.3s ease;
}

input#search, #massFilter:focus {
  outline: none; 
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

input#search, #massFilter::placeholder {
  color: #888; 
  font-style: italic; 
}


ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
}

li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease;
}

li:hover {
  transform: scale(1.05);
}

img {
  border-radius: 8px;
  margin-bottom: 12px;
}

.rocket-form {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-add {
  background-color: #4CAF50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add:hover {
  background-color: #3e8e41;
}
</style>
