<template>
  <v-dialog v-model="isOpen" max-width="600px" persistent @after-leave="resetForm">
    <!-- Explicitly set color to white to prevent dark-mode bleeding on inputs -->
    <v-card class="rounded-xl text-black" color="white">
      <v-card-title class="d-flex justify-space-between align-center pa-4 bg-grey-lighten-4">
        <span class="text-h6 font-weight-bold">Add New Rocket</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="closeModal" color="black"></v-btn>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-4 bg-white">
        <!-- Main Form wrapper with validation ref -->
        <v-form ref="form" v-model="isValid" @submit.prevent="submitForm">
          <v-text-field
            v-model="formData.name"
            label="Rocket Name *"
            :rules="[rules.required('Name is required')]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.country"
            label="Country of Origin *"
            :rules="[rules.required('Country is required')]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model.number="formData.cost_per_launch"
            label="Cost per Launch (USD) *"
            type="number"
            :rules="[rules.required('Cost is required'), rules.positive]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-switch
            v-model="formData.active"
            :label="formData.active ? 'Status: Active' : 'Status: Inactive'"
            color="success"
            class="mb-2"
            hide-details
          ></v-switch>

          <v-textarea
            v-model="formData.description"
            label="Short Description *"
            :rules="[rules.required('Description is required')]"
            variant="outlined"
            rows="3"
            density="comfortable"
          ></v-textarea>
        </v-form>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer></v-spacer>
        <v-btn text="Cancel" variant="text" @click="closeModal" class="text-none"></v-btn>
        <v-btn color="blue-darken-3" variant="flat" text="Save Rocket" @click="submitForm" class="text-none px-6 rounded-lg"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { RocketDTO } from '@/types/rocket'
import { VForm } from 'vuetify/components'

// 1. Use defineModel to replace props, emit, and double watch
const isOpen = defineModel<boolean>({ default: false })

// 5. Define explicit emit payload
const emit = defineEmits<{
  (e: 'submit', payload: Partial<RocketDTO>): void
}>()

// 2. Strong typing for Vuetify Form ref instead of <any>
const form = ref<InstanceType<typeof VForm> | null>(null)
const isValid = ref(false)

// Default clean state
const getInitialState = () => ({
  name: '',
  country: '',
  cost_per_launch: null as number | null,
  active: true,
  description: ''
})

const formData = ref(getInitialState())

// 4. Extracted validation rules (Strict Type, no 'any')
const rules = {
  required: (message: string) => (v: unknown) => !!v || message,
  positive: (v: unknown) => Number(v) > 0 || 'Cost must be positive'
}

// Close action only toggles state
const closeModal = () => {
  isOpen.value = false
}

// 3. Reset logic now triggered by @after-leave event from v-dialog
const resetForm = () => {
  formData.value = getInitialState()
  form.value?.resetValidation()
}

// Validate and bubble up
const submitForm = async () => {
  const result = await form.value?.validate()
  if (result?.valid) {
    emit('submit', { 
      ...formData.value,
      cost_per_launch: formData.value.cost_per_launch ?? 0
    })
    closeModal()
  }
}
</script>
