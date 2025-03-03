<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['addRocket']);

const rocketName = ref('');
const rocketDescription = ref('');
const rocketImage = ref('');

const submitForm = () => {
  if (!rocketName.value || !rocketDescription.value || !rocketImage.value) {
    alert('Please fill all fields');
    return;
  }
  
  const newRocket = {
    name: rocketName.value,
    description: rocketDescription.value,
    image: rocketImage.value,
  };

  emit('addRocket', newRocket);

  rocketName.value = '';
  rocketDescription.value = '';
  rocketImage.value = '';
};
</script>

<template>
  <form @submit.prevent="submitForm" class="rocket-form">
    <label>Rocket Name:</label>
    <input v-model="rocketName" type="text" required />

    <label>Rocket Description:</label>
    <textarea v-model="rocketDescription" required></textarea>

    <label>Rocket Image URL:</label>
    <input v-model="rocketImage" type="text" required />

    <button type="submit">Add Rocket</button>
  </form>
</template>

<style scoped>
.rocket-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, textarea {
  padding: 8px;
  font-size: 14px;
  width: 100%;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
