<script setup lang="ts">
import { ref } from 'vue'
import { useRocketStore } from '@/store/rocket'
import { useRouter } from 'vue-router'

const store = useRocketStore()
const router = useRouter()

const name = ref('')
const description = ref('')
const country = ref('')
const firstFlight = ref('')
const cost = ref<number | null>(null)
const imageUrl = ref('')

const submit = () => {
  if (!name.value) return

  store.addRocket({
    id: Date.now().toString(),
    name: name.value,
    description: description.value,
    country: 'Custom',
    first_flight: '-',
    cost_per_launch: 0,
    flickr_images: []
  })

  name.value = ''
  description.value = ''
  country.value = ''
  firstFlight.value = ''
  cost.value = null
  imageUrl.value = ''

  router.push('/')
}
</script>

<template>
  <form class="add-form" @submit.prevent="submit">
    <h3>Add New Rocket</h3>

    <div class="field">
      <label>Rocket Name</label>
      <input v-model="name" placeholder="Falcon X" />
    </div>

    <div class="field">
      <label>Description</label>
      <textarea
        v-model="description"
        placeholder="Rocket description"
        rows="3"
      />
    </div>

    <div class="field">
      <label>Country</label>
      <input v-model="country" placeholder="USA" />
    </div>

    <div class="field">
      <label>First Flight</label>
      <input v-model="firstFlight" type="date" />
    </div>

    <div class="field">
      <label>Cost per Launch ($)</label>
      <input
        v-model.number="cost"
        type="number"
        placeholder="50000000"
      />
    </div>

    <div class="field">
      <label>Image URL</label>
      <input
        v-model="imageUrl"
        placeholder="https://example.com/rocket.jpg"
      />
    </div>

    <button type="submit">➕ Add Rocket</button>
  </form>
</template>

<style scoped>
.add-form {
  background: #0b1220;
  border: 1px solid #1e293b;
  border-radius: 16px;

  padding: 1.25rem;
  width: 100%;
  max-width: 420px;

  margin: 2rem auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Title */
.add-form h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #e5e7eb;
  text-align: center;
}

/* Field */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Input */
input,
textarea {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;

  color: #e5e7eb;
  font-size: 0.9rem;
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: #6b7280;
}

input:focus,
textarea:focus {
  border-color: #2563eb;
}

/* Button */
button {
  margin-top: 0.5rem;
  /* align-self: flex-start; */
  align-self: center;

  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;

  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;

  transition: background 0.2s ease, transform 0.15s ease;
}

button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* Mobile */
@media (max-width: 600px) {
  .add-form {
    max-width: 100%;
  }
}
</style>
