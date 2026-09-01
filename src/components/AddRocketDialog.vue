<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="[rules.required]"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            placeholder="https://example.com/image.jpg"
            class="mb-2"
          />

          <v-text-field
            v-model="form.launch_cost"
            label="Launch Cost"
            variant="outlined"
            placeholder="$50 million"
            class="mb-2"
          />

          <v-text-field
            v-model="form.manufacturer_name"
            label="Manufacturer Name *"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country Code *"
            :rules="[rules.required, rules.countryCode]"
            variant="outlined"
            placeholder="USA"
            class="mb-2"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight Date"
            variant="outlined"
            type="date"
          />
        </v-form>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
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
          :loading="loading"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

interface Props {
  modelValue: boolean
}

interface Emit {
  (e: 'update:modelValue', value: boolean): void
  (e: 'rocket-added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const rocketStore = useRocketStore()
const formRef = ref<any>(null)
const loading = ref(false)
const errorMessage = ref('')

interface RocketForm {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  manufacturer_name: string
  country_code: string
  maiden_flight: string
}

const form = ref<RocketForm>({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  manufacturer_name: '',
  country_code: '',
  maiden_flight: ''
})

const rules = {
  required: (v: string) => !!v || 'This field is required',
  countryCode: (v: string) => {
    if (!v) return true
    return v.length >= 2 && v.length <= 3 || 'Country code must be 2-3 characters'
  }
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  
  if (!valid) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const newId = -Date.now()

    const newRocket: Rocket = {
      id: newId,
      full_name: form.value.full_name,
      description: form.value.description,
      image_url: form.value.image_url || null,
      launch_cost: form.value.launch_cost || null,
      maiden_flight: form.value.maiden_flight || null,
      manufacturer: {
        id: newId,
        name: form.value.manufacturer_name,
        country_code: form.value.country_code.toUpperCase()
      }
    }

    rocketStore.addRocket(newRocket)
    emit('rocket-added')
    handleClose()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to add rocket'
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:modelValue', false)
}

function resetForm() {
  form.value = {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    manufacturer_name: '',
    country_code: '',
    maiden_flight: ''
  }
  errorMessage.value = ''
  formRef.value?.resetValidation()
}
</script>
