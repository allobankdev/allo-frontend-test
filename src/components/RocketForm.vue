<template>
  <div class="form-container">
    <h3>Add New Rocket</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Rocket Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter rocket name"
        />
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea
          id="description"
          v-model="form.description"
          required
          placeholder="Enter rocket description"
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="country">Country</label>
          <input
            id="country"
            v-model="form.country"
            type="text"
            placeholder="e.g., USA"
          />
        </div>

        <div class="form-group">
          <label for="cost">Cost per Launch ($)</label>
          <input
            id="cost"
            v-model="form.costPerLaunch"
            type="number"
            placeholder="e.g., 50000000"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="firstFlight">First Flight</label>
          <input
            id="firstFlight"
            v-model="form.firstFlight"
            type="date"
          />
        </div>

        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="text"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <button type="submit" class="submit-button">
        Add Rocket
      </button>
      <button type="button" @click="resetForm" class="reset-button">
        Reset
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRocketStore } from '../store';
import type { NewRocketForm } from '../types';

const rocketStore = useRocketStore();

const form = ref<NewRocketForm>({
  name: '',
  description: '',
  country: '',
  costPerLaunch: '',
  firstFlight: '',
  imageUrl: ''
});

const handleSubmit = (): void => {
  rocketStore.addNewRocket(form.value);
  resetForm();
  
  // Show success message
  alert('Rocket added successfully!');
};

const resetForm = (): void => {
  form.value = {
    name: '',
    description: '',
    country: '',
    costPerLaunch: '',
    firstFlight: '',
    imageUrl: ''
  };
};
</script>

<style scoped>
/* CSS sama seperti sebelumnya */
.form-container {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.form-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.submit-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #1976d2;
}

.reset-button {
  background-color: #757575;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #616161;
}
</style>