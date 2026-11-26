<template>
  <v-form ref="formRef" @submit.prevent="submit">
    <v-card-text class="px-6 pt-0">
      <v-text-field
        v-model="form.name"
        label="Rocket name *"
        variant="outlined"
        :rules="[requiredRule]"
        autofocus
      />

      <v-textarea
        v-model="form.description"
        label="Description"
        variant="outlined"
        rows="3"
        auto-grow
      />

      <v-text-field
        v-model="form.image_url"
        label="Image URL"
        variant="outlined"
        placeholder="https://example.com/rocket.jpg"
        :rules="[urlRule]"
      />

      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.launch_cost"
            label="Cost per launch (USD)"
            variant="outlined"
            type="number"
            min="0"
            :rules="[costRule]"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.manufacturer_country"
            label="Country code"
            variant="outlined"
            placeholder="USA"
            maxlength="3"
            :rules="[countryRule]"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="form.maiden_flight"
        label="First flight"
        variant="outlined"
        type="date"
      />
    </v-card-text>

    <v-card-actions class="px-6 pb-6">
      <v-spacer />
      <v-btn variant="text" @click="emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" type="submit">
        Add rocket
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import type { NewRocketInput } from '@/types/rocket'

interface RocketFormInstance {
  validate: () => Promise<{ valid: boolean; errors: string[] }>
  resetValidation: () => void
}

const emit = defineEmits<{
  submit: [input: NewRocketInput]
  cancel: []
}>()

const formRef = ref<RocketFormInstance | null>(null)

const form = reactive({
  name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  manufacturer_country: '',
  maiden_flight: '',
})

function requiredRule(value: unknown): boolean | string {
  return Boolean(String(value ?? '').trim()) || 'This field is required.'
}

function urlRule(value: unknown): boolean | string {
  const text = String(value ?? '').trim()
  if (!text) return true

  try {
    const url = new URL(text)
    return ['http:', 'https:'].includes(url.protocol) || 'Use an http(s) URL.'
  } catch {
    return 'Enter a valid URL.'
  }
}

function costRule(value: unknown): boolean | string {
  const text = String(value ?? '').trim()
  if (!text) return true

  const amount = Number(text)
  return (Number.isFinite(amount) && amount >= 0) || 'Enter a valid amount.'
}

function countryRule(value: unknown): boolean | string {
  const text = String(value ?? '').trim()
  return !text || /^[A-Za-z]{2,3}$/.test(text) || 'Use a 2–3 letter country code.'
}

async function submit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim(),
    launch_cost: form.launch_cost.trim() ? Number(form.launch_cost) : null,
    manufacturer_country: form.manufacturer_country.trim().toUpperCase(),
    maiden_flight: form.maiden_flight,
  })
}
</script>
