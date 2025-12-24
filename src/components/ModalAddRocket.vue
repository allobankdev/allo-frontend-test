<template>
    <v-dialog
      max-width="640"
      persistent
      scrollable
    >
      <v-card class="add-rocket-dialog">
        <v-card-title class="font-weight-light text-h5">
          Add Custom Rocket
        </v-card-title>

        <v-card-actions class="pa-6 pt-2">
          <v-btn
            variant="text"
            size="large"
            @click="handleCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            :disabled="!valid"
            class="submit-btn"
            @click="handleSubmit"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import { useRocketsStore } from '@/stores/RocketStore'
  
  const props = defineProps<{
    modelValue: boolean
  }>()
  
  const rocketStore = useRocketsStore()
  const formRef = ref()
  const valid = ref(false)
  
  const form = ref({
    name: '',
    description: '',
    cost_per_launch: 0,
    country: '',
    first_flight: '',
    active: true,
    imageUrl: '',
  })
  
  const statusOptions = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false },
  ]
  
  function resetForm() {
    form.value = {
      name: '',
      description: '',
      cost_per_launch: 0,
      country: '',
      first_flight: '',
      active: true,
      imageUrl: '',
    }
  }
  
  function handleCancel() {
  }
  
  function handleSubmit() {
    if (!valid.value) return
  
    const formData : Rocket = {
      id: `custom`,
      name: form.value.name,
      type: 'Custom',
      description: form.value.description,
      cost_per_launch: form.value.cost_per_launch,
      country: form.value.country,
      first_flight: form.value.first_flight,
      flickr_images: [form.value.imageUrl],
      active: form.value.active,
    }
  
    console.log(formData)
  }
  </script>
  
  <style scoped>
  </style>
  
  