<template>
  <v-dialog
    max-width="560"
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-bold">Add New Rocket</span>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleClose"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                density="comfortable"
                label="Rocket Name *"
                placeholder="e.g. Starship Block 3"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                density="comfortable"
                label="Description *"
                placeholder="Describe the rocket capabilities and mission profile"
                rows="3"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                density="comfortable"
                label="Image URL (optional)"
                placeholder="https://example.com/rocket.jpg"
                :rules="[rules.optionalUrl]"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.costPerLaunch"
                density="comfortable"
                label="Cost per Launch in USD (optional)"
                min="0"
                placeholder="e.g. 67000000"
                :rules="[rules.optionalPositiveNumber]"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                density="comfortable"
                label="Country Code (optional)"
                placeholder="e.g. USA"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.firstFlight"
                density="comfortable"
                label="First Flight Date (optional)"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { NewRocketPayload } from '@/types/rocket'

  interface Props {
    modelValue: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'submit': [payload: NewRocketPayload]
  }>()

  interface VFormInstance {
    validate: () => Promise<{ valid: boolean }>
    resetValidation: () => void
  }

  const formRef = ref<VFormInstance | null>(null)

  const form = reactive({
    name: '',
    description: '',
    imageUrl: '',
    costPerLaunch: '',
    country: 'USA',
    firstFlight: '',
  })

  const rules = {
    required: (value: string) => Boolean(value?.trim()) || 'This field is required',
    optionalUrl: (value: string) => {
      const trimmed = value?.trim()
      if (!trimmed) return true
      try {
        const parsed = new URL(trimmed)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
          || 'Enter a valid http/https URL'
      } catch {
        return 'Enter a valid http/https URL'
      }
    },
    optionalPositiveNumber: (value: string) => {
      if (value === '' || value === null || value === undefined) return true
      const numeric = Number(value)
      return (Number.isFinite(numeric) && numeric >= 0) || 'Enter a valid non-negative number'
    },
  }

  function resetForm () {
    form.name = ''
    form.description = ''
    form.imageUrl = ''
    form.costPerLaunch = ''
    form.country = 'USA'
    form.firstFlight = ''
    formRef.value?.resetValidation()
  }

  function handleClose () {
    resetForm()
    emit('update:modelValue', false)
  }

  async function handleSubmit () {
    const validation = await formRef.value?.validate()
    if (!validation?.valid) return

    const parsedCost = form.costPerLaunch === '' ? null : Number(form.costPerLaunch)

    emit('submit', {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl || undefined,
      costPerLaunch: parsedCost,
      country: form.country || undefined,
      firstFlight: form.firstFlight || undefined,
    })

    resetForm()
    emit('update:modelValue', false)
  }
</script>