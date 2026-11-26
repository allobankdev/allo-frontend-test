<template>
  <v-dialog
    max-width="560"
    :model-value="modelValue"
    persistent
    scrollable
    width="100%"
    @update:model-value="handleDialogToggle"
  >
    <v-card
      border
      class="add-rocket-dialog-card d-flex flex-column"
      color="#0f172a"
      max-height="90dvh"
      rounded="xl"
    >
      <v-card-title class="d-flex align-center justify-space-between px-4 px-sm-6 pt-5 pb-2">
        <div class="d-flex align-center ga-3 min-width-0">
          <v-avatar
            class="flex-shrink-0"
            color="primary"
            rounded="lg"
            size="36"
            variant="tonal"
          >
            <v-icon
              icon="mdi-rocket-launch"
              size="20"
            />
          </v-avatar>
          <span class="text-h6 font-weight-bold text-white text-truncate">
            Add New Rocket
          </span>
        </div>

        <v-btn
          aria-label="Close dialog"
          class="flex-shrink-0"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleCancel"
        />
      </v-card-title>

      <v-card-subtitle class="px-4 px-sm-6 pb-3 text-wrap">
        Add a custom rocket to your local SpaceX Explorer list.
      </v-card-subtitle>

      <v-form
        ref="formRef"
        class="d-flex flex-column overflow-hidden flex-grow-1"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="px-4 px-sm-6 pt-2 pb-2 overflow-y-auto">
          <v-text-field
            v-model="formState.fullName"
            class="mb-3"
            label="Rocket Name *"
            placeholder="e.g. Starship Block 3"
            :rules="nameRules"
            variant="outlined"
          />

          <v-textarea
            v-model="formState.description"
            class="mb-3"
            label="Description"
            placeholder="Brief description of the rocket..."
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="formState.imageUrl"
            class="mb-3"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
          />

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formState.launchCost"
                label="Launch Cost (USD)"
                min="0"
                placeholder="e.g. 50000000"
                :rules="launchCostRules"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formState.countryCode"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formState.maidenFlight"
            label="First Flight"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="px-4 px-sm-6 pb-5 pt-3 justify-end flex-wrap ga-2">
          <v-btn
            rounded="lg"
            variant="text"
            @click="handleCancel"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            rounded="lg"
            type="submit"
            variant="flat"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { NewRocketInput } from '@/stores/rocketStore'

interface Props {
  modelValue: boolean
}

interface VFormInstance {
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: NewRocketInput]
}>()

const formRef = ref<VFormInstance | null>(null)

const formState = reactive({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: '',
  maidenFlight: '',
})

const nameRules = [
  (value: string): boolean | string => value.trim().length > 0 || 'Rocket name is required.',
]

const launchCostRules = [
  (value: string): boolean | string => {
    const trimmed = String(value ?? '').trim()
    if (trimmed.length === 0) {
      return true
    }

    const parsed = Number(trimmed)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 'Launch cost must be a valid non-negative number.'
    }

    return true
  },
]

function toOptionalString(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function resetForm(): void {
  formState.fullName = ''
  formState.description = ''
  formState.imageUrl = ''
  formState.launchCost = ''
  formState.countryCode = ''
  formState.maidenFlight = ''
  formRef.value?.resetValidation()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  },
)

function handleDialogToggle(value: boolean): void {
  emit('update:modelValue', value)
}

function handleCancel(): void {
  emit('update:modelValue', false)
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return
  }

  const { valid } = await formRef.value.validate()
  if (!valid) {
    return
  }

  const trimmedCountry = toOptionalString(formState.countryCode)
  const trimmedCost = String(formState.launchCost ?? '').trim()

  const payload: NewRocketInput = {
    full_name: formState.fullName.trim(),
    description: toOptionalString(formState.description),
    image_url: toOptionalString(formState.imageUrl),
    launch_cost: trimmedCost.length > 0 ? trimmedCost : null,
    maiden_flight: toOptionalString(formState.maidenFlight),
    manufacturer: trimmedCountry ? { country_code: trimmedCountry } : null,
  }

  emit('submit', payload)
  resetForm()
  emit('update:modelValue', false)
}
</script>
