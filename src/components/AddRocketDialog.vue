<script setup lang="ts">
import type { CreateRocketPayload } from '@/types/rocket';
import { ref } from 'vue';
import { generateUniqueRandomNumbers, isValidCountryCode, rules } from './utils/helper';


defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: CreateRocketPayload): void
}>()

const errorMessage = ref<string>('')
const form = ref<CreateRocketPayload>({
  full_name: "",
    manufacturer: {
      id: 0,
      description: "",
      country_code: "",
    },
    image_url: "",

    name: "",
    description:"" ,
    launch_cost: "",
    maiden_flight: "",
})

function resetForm() {
  form.value = {
    full_name: '',
    name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    manufacturer: {
      id: 0,
      description: '',
      country_code: '',
    },
  }
  errorMessage.value = ''
}

function handleClose() {
  resetForm()
  emit('update:modelValue', false)
}

function handleSubmit() {
  errorMessage.value = ''

  if (!form.value.full_name.trim()) {
    errorMessage.value = 'Rocket Name wajib diisi.'
    return
  }

  if (!form.value.launch_cost || !form.value.manufacturer?.country_code || !form.value.maiden_flight) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  if (!isValidCountryCode(form.value.manufacturer.country_code)) {
    errorMessage.value = 'Invalid country code. Please use a valid country code (e.g. USA, LAU).'
    return
  }

  emit('submit', {
    full_name: form.value.full_name.trim(),
    name: form.value.full_name.trim(),
    description: form.value.description?.trim() || '',
    image_url: form.value.image_url?.trim() || '',
    launch_cost: form.value.launch_cost,
    maiden_flight: form.value.maiden_flight,
    manufacturer: {
      id: generateUniqueRandomNumbers(2, 1, 100)[0],
      description: form.value.description?.trim() || '',
      country_code: form.value.manufacturer.country_code.toUpperCase(),
    },
  })

  handleClose()
}
</script>
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card title="Add New Rocket">
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            variant="outlined"
            required
            class="mb-2"
          />

          <v-textarea
            v-model="form.description!"
            label="Rocket Description (Optional)"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.manufacturer!.country_code"
            label="Country Code *"
            variant="outlined"
            placeholder="e.g. USA, LAU, RUS, CHN"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="form.launch_cost"
            label="Cost per Launch *"
            variant="outlined"
            type="number"
            placeholder="1000000"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight *"
            placeholder="YYYY-MM-DD"
            variant="outlined"
            required
            :rules="[rules.required, rules.datePattern, rules.validDate]"
            clearable
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url!"
            label="Picture URL (Optional)"
            variant="outlined"
            placeholder="https://..."
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="handleSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
