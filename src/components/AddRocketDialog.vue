<template>
  <v-dialog
    :model-value="modelValue"
    max-width="650"
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5">
        <span class="text-h6 font-weight-bold">
          Add New Rocket
        </span>

        <v-btn
          icon="mdi-close"
          variant="text"
          aria-label="Close dialog"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <v-form ref="form" @submit.prevent="submitRocket">
          <v-text-field
            v-model="rocketName"
            label="Rocket Name"
            placeholder="Enter rocket name"
            :rules="nameRules"
            variant="outlined"
            class="mb-3"
          />

          <v-textarea
            v-model="description"
            label="Description"
            placeholder="Describe the rocket"
            :rules="descriptionRules"
            variant="outlined"
            rows="3"
            class="mb-3"
          />

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="country"
                label="Country"
                placeholder="Enter country"
                :rules="requiredRules"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="active"
                label="Status"
                :items="statusOptions"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="firstFlight"
                label="First Flight"
                type="date"
                :rules="dateRules"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="launchCost"
                label="Launch Cost (USD)"
                type="number"
                min="0"
                step="0.01"
                :rules="costRules"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="imageUrl"
            label="Image URL (Optional)"
            placeholder="https://example.com/rocket.jpg"
            :rules="imageRules"
            variant="outlined"
          />

          <v-divider class="my-4" />

          <div class="d-flex justify-end ga-3">
            <v-btn variant="outlined" @click="closeDialog">
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              type="submit"
            >
              Add Rocket
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [rocket: RocketInput]
}>()

const form = ref<{
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
} | null>(null)

const rocketName = ref('')
const description = ref('')
const country = ref('')
const firstFlight = ref('')
const launchCost = ref('')
const imageUrl = ref('')
const active = ref(true)

const statusOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
]

const requiredRules = [
  (value: string) =>
    !!value?.trim() || 'This field is required',
]

const nameRules = [
  (value: string) =>
    value.trim().length >= 2 ||
    'Name must contain at least 2 characters',
]

const descriptionRules = [
  (value: string) =>
    value.trim().length >= 10 ||
    'Description must contain at least 10 characters',
]

const dateRules = [
  (value: string) => {
    if (!value) return 'First flight date is required'

    const parsed = new Date(`${value}T00:00:00Z`)

    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    ) || 'Enter a valid date'
  },
]

const costRules = [
  (value: string) =>
    (
      value !== '' &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0
    ) || 'Enter a valid cost of zero or more',
]

const imageRules = [
  (value: string) => {
    if (!value?.trim()) return true

    try {
      const url = new URL(value)
      return (
        url.protocol === 'http:' ||
        url.protocol === 'https:'
      ) || 'Image URL must use HTTP or HTTPS'
    } catch {
      return 'Enter a valid image URL'
    }
  },
]

function resetForm() {
  rocketName.value = ''
  description.value = ''
  country.value = ''
  firstFlight.value = ''
  launchCost.value = ''
  imageUrl.value = ''
  active.value = true

  form.value?.resetValidation()
}

function closeDialog() {
  emit('update:modelValue', false)
}

async function submitRocket() {
  const result = await form.value?.validate()

  if (!result?.valid) return

  const input: RocketInput = {
    name: rocketName.value.trim(),
    description: description.value.trim(),
    country: country.value.trim(),
    firstFlight: firstFlight.value,
    launchCost: Number(launchCost.value),
    imageUrl: imageUrl.value.trim() || null,
    active: active.value,
  }

  emit('submit', input)
  closeDialog()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) resetForm()
  },
)
</script>
