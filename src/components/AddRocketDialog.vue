<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'add-rocket']);

const localRocket = ref({
  name: '',
  description: '',
  image: '',
  country: '',
  cost_per_launch: null as number | null,
  first_flight: ''
});
const errors = ref({
  name: '',
  description: '',
  image: '',
  country: '',
  cost_per_launch: '',
  first_flight: ''
})

const closeDialog = () => {
  emit('update:modelValue', false);
  resetForm();
}

const validateForm = () => {
  let isValid = true;

  // Reset error messages
  errors.value = {
    name: '',
    description: '',
    image: '',
    country: '',
    cost_per_launch: '',
    first_flight: ''
  };

  // Name validation
  if (!localRocket.value.name.trim()) {
    errors.value.name = 'Rocket name is required';
    isValid = false;
  }

  // Description validation
  if (!localRocket.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }

  // Image URL validation
  if (!localRocket.value.image.trim()) {
    errors.value.image = 'Image URL is required';
    isValid = false;
  }

  // Country validation
  if (!localRocket.value.country.trim()) {
    errors.value.country = 'Country is required';
    isValid = false;
  }

  // Cost per Launch validation
  if (localRocket.value.cost_per_launch === null || isNaN(localRocket.value.cost_per_launch)) {
    errors.value.cost_per_launch = 'Cost per Launch must be a number';
    isValid = false;
  } else if (localRocket.value.cost_per_launch < 0) {
    errors.value.cost_per_launch = 'Cost per Launch cannot be negative';
    isValid = false;
  }

  // First Flight validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!localRocket.value.first_flight.match(dateRegex)) {
    errors.value.first_flight = 'First Flight must be in YYYY-MM-DD format';
    isValid = false;
  }

  return isValid;
};

const addRocket = () => {
  if (!validateForm()) return;

  const newRocketData = {
    id: Date.now().toString(),
    name: localRocket.value.name,
    description: localRocket.value.description,
    flickr_images: [localRocket.value.image],
    country: localRocket.value.country,
    cost_per_launch: localRocket.value.cost_per_launch,
    first_flight: localRocket.value.first_flight
  };

  emit('add-rocket', newRocketData);
  closeDialog();
};

const resetForm = () => {
  localRocket.value = { name: '', description: '', image: '', country: '', cost_per_launch: null, first_flight: '' };
  errors.value = { name: '', description: '', image: '', country: '', cost_per_launch: '', first_flight: '' };
};
</script>

<template>
  <v-dialog :model-value="props.modelValue" max-width="500px" @update:modelValue="closeDialog">
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <v-text-field v-model="localRocket.name" label="Rocket Name" variant="outlined" :error-messages="errors.name"></v-text-field>
        <v-text-field v-model="localRocket.description" label="Description" variant="outlined" :error-messages="errors.description"></v-text-field>
        <v-text-field v-model="localRocket.image" label="Image URL" variant="outlined" :error-messages="errors.image"></v-text-field>
        <v-text-field v-model="localRocket.country" label="Country" variant="outlined" :error-messages="errors.country"></v-text-field>
        <v-text-field
          v-model="localRocket.cost_per_launch"
          label="Cost per Launch ($)"
          type="number"
          variant="outlined"
          :error-messages="errors.cost_per_launch"
        ></v-text-field>
        <v-text-field
          v-model="localRocket.first_flight"
          label="First Flight (YYYY-MM-DD)"
          variant="outlined"
          :error-messages="errors.first_flight"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue-darken-1" @click="closeDialog">Cancel</v-btn>
        <v-btn color="green" @click="addRocket">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.v-messages__message {
  margin-bottom: 1rem;
}

</style>
