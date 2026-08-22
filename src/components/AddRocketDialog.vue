<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h6 font-weight-bold">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name"
            placeholder="Enter rocket name"
            variant="outlined"
            :rules="[requiredRule]"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Enter rocket description"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://..."
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.launch_cost"
            label="Cost Per Launch"
            placeholder="Enter launch cost"
            type="number"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.country"
            label="Country"
            placeholder="Enter country code"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />

        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { Rocket } from '@/types/rocket'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  add: [rocket: Rocket]
}>()

const formRef = ref()

const form = ref({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country: '',
  maiden_flight: '',
})

function requiredRule(value: string) {
  return !!value || 'Rocket name is required'
}

async function submit() {
  const validation = await formRef.value?.validate()

  if (!validation?.valid) {
    return
  }

  const rocket: Rocket = {
    id: `local-${Date.now()}`,
    full_name: form.value.full_name,
    description: form.value.description || null,
    image_url: form.value.image_url || null,
    launch_cost: form.value.launch_cost
      ? Number(form.value.launch_cost)
      : null,
    maiden_flight: form.value.maiden_flight || null,
    manufacturer: {
      name: 'Custom',
      country_code: form.value.country || null,
    },
  }

  emit('add', rocket)

  resetForm()
  close()
}

function close() {
  emit('update:modelValue', false)
}

function resetForm() {
  form.value = {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country: '',
    maiden_flight: '',
  }

  formRef.value?.resetValidation()
}
</script>