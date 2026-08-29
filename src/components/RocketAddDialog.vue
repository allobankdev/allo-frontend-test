<template>
    <v-dialog
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      max-width="600"
      scrollable
    >
      <v-card class="add-rocket-dialog">
       <v-card-item class="pa-8">
        <v-card-title class="font-weight-light text-h5 mb-3">
          Add Custom Rocket
        </v-card-title>
        
        <v-form 
          ref="formRef"
          v-model="isValid"
          @submit.prevent="handleSubmit"
        >
          <v-text-field 
            v-model="form.name"
            label="Rocket Name *"
            name="name"
            :rules="[rules.required]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
            autocomplete="off"
          />

          <v-textarea
            v-model="form.description"
            label="Description *"
            name="description"
            :rules="[rules.required]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
            rows="3"
            autocomplete="off"
          />

          <v-text-field 
            v-model.number="form.cost_per_launch"
            label="Cost per Launch *"
            name="cost_per_launch"
            type="number"
            :rules="[rules.required, rules.positiveNumber]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
            prefix="$"
          />

          <v-text-field 
            v-model="form.country"
            label="Country *"
            name="country"
            :rules="[rules.required]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
          />

          <v-text-field 
            v-model="form.first_flight"
            label="First Flight Date *"
            name="first_flight"
            type="date"
            :rules="[rules.required]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
            placeholder="YYYY-MM-DD"
          />

          <v-select
            v-model="form.active"
            label="Status *"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            :rules="[rules.required]"
            class="mb-3"
            variant="outlined"
            density="comfortable"
          />

          <v-text-field 
            v-model="form.imageUrl"
            label="Image URL"
            name="imageUrl"
            class="mb-3"
            variant="outlined"
            density="comfortable"
            placeholder="https://example.com/image.jpg"
          />
        </v-form>

        <v-card-actions class="d-flex justify-end pa-0 pt-3">
          <v-btn
            variant="text"
            size="large"
            @click="handleClose"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            :disabled="!isValid"
            class="submit-btn"
            @click="handleSubmit"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
       </v-card-item>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import { useRocketsStore } from '@/stores/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()
  
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()
  
  const rocketStore = useRocketsStore()
  const formRef = ref()
  const isValid = ref(false)
  
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

  const rules = {
    required: (value: any) => !!value || 'This field is required',
    positiveNumber: (value: number) => value > 0 || 'Must be positive number'
  }
  
  const resetForm = () => {
    form.value = {
      name: '',
      description: '',
      cost_per_launch: 0,
      country: '',
      first_flight: '',
      active: true,
      imageUrl: '',
    }
    formRef.value?.resetValidation()
  }
  
  const handleClose = () => {
    resetForm()
    emit('update:modelValue', false)
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    const { valid } = await formRef.value.validate()
    if (!valid) return

    const formData: Rocket = {
      id: `custom${Math.random()}`,
      name: form.value.name,
      type: 'Custom',
      description: form.value.description,
      cost_per_launch: form.value.cost_per_launch,
      country: form.value.country,
      first_flight: form.value.first_flight,
      flickr_images: form.value.imageUrl ? [form.value.imageUrl] : [],
      active: form.value.active,
    }

    rocketStore.addRocket(formData)
    resetForm()
    emit('update:modelValue', false)
  }

  // Reset form when dialog closes
  watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
      resetForm()
    }
  })
  </script>
  
  <style scoped>
  </style>
  
  