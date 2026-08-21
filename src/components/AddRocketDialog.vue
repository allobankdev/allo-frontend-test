<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" class="dialog-card pa-1 bg-white">
      <!-- Compact Header -->
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-3 pb-1">
        <div>
          <span class="text-subtitle-1 font-weight-bold text-slate-900 d-block">Add New Rocket</span>
          <span class="text-caption text-slate-500 font-weight-normal">
            Add a custom launch vehicle configuration to your local fleet.
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="x-small"
          class="text-slate-400"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider class="my-2 border-subtle" />

      <!-- Form Body with Numeric Blocker and Calendar Datepicker -->
      <v-card-text class="px-4 py-1">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-row dense>
            <!-- Full Name (Required) -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Full Name *"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Short Name & Country -->
            <v-col cols="6">
              <v-text-field
                v-model="form.name"
                label="Short Name"
                placeholder="e.g. Starship"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
              />
            </v-col>

            <!-- Cost per Launch (Strict Numeric Input with Keystroke Blocker) -->
            <v-col cols="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Cost / Launch ($)"
                placeholder="e.g. 10000000"
                type="number"
                min="0"
                step="any"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.positiveNumberOrEmpty]"
                @keydown="preventNonNumeric"
              />
            </v-col>

            <!-- Maiden Flight Date (Interactive Calendar Picker) -->
            <v-col cols="6">
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2 custom-date-input"
              />
            </v-col>

            <!-- Image URL (URL Validation) -->
            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL (Optional)"
                placeholder="https://example.com/rocket.jpg"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.urlOrEmpty]"
              />
            </v-col>

            <!-- Description (Required) -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Rocket Description *"
                placeholder="Provide details about the rocket's mission and specs..."
                variant="outlined"
                density="compact"
                rows="2"
                rounded="lg"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Status Switch -->
            <v-col cols="12" class="d-flex align-center justify-space-between pt-1">
              <v-switch
                v-model="form.active"
                color="success"
                label="Active Launch Vehicle"
                density="compact"
                hide-details
                class="compact-switch"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="my-2 border-subtle" />

      <!-- Compact Actions -->
      <v-card-actions class="px-4 pb-3 pt-1">
        <v-spacer />
        <v-btn
          variant="text"
          rounded="lg"
          size="small"
          class="text-none font-weight-medium text-slate-600 px-3"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          size="small"
          class="text-none font-weight-semibold px-4 action-btn"
          @click="handleSubmit"
        >
          Add to Fleet
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', rocket: NewRocketInput): void
}>()

const isFormValid = ref(false)
const formRef = ref()

const initialFormState = (): NewRocketInput => ({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
})

const form = reactive<NewRocketInput>(initialFormState())

const rules = {
  required: (v: string) => Boolean(v && v.trim().length > 0) || 'This field is required.',
  positiveNumberOrEmpty: (v: string) => {
    if (!v || v.trim() === '') return true
    const clean = v.trim()
    const isNum = /^\d+(\.\d+)?$/.test(clean)
    return (isNum && Number(clean) >= 0) || 'Must be a valid positive number.'
  },
  urlOrEmpty: (v: string) => {
    if (!v || v.trim() === '') return true
    return /^https?:\/\/.+/.test(v.trim()) || 'Must be a valid URL starting with http:// or https://'
  },
}

/**
 * Keystroke blocker: allows positive numbers, decimals, navigation, and editing shortcuts
 */
function preventNonNumeric(event: KeyboardEvent) {
  // Allow navigation, editing keys, and modifier combinations (Ctrl/Cmd)
  if (
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(event.key) ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return
  }

  // Allow digits
  if (/[0-9]/.test(event.key)) {
    return
  }

  // Allow decimal point if not already typed
  if (event.key === '.' && (!form.launch_cost || !String(form.launch_cost).includes('.'))) {
    return
  }

  // Disallow any other non-numeric character
  event.preventDefault()
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(form, initialFormState())
      formRef.value?.resetValidation()
    }
  }
)

function closeDialog() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  const newRocket: NewRocketInput = {
    name: form.name?.trim() || form.full_name.trim(),
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: form.image_url?.trim() || undefined,
    launch_cost: form.launch_cost ? String(form.launch_cost).trim() : undefined,
    country_code: form.country_code?.trim() || 'USA',
    maiden_flight: form.maiden_flight ? form.maiden_flight.trim() : undefined,
    active: form.active ?? true,
  }

  emit('submit', newRocket)
  closeDialog()
}
</script>

<style scoped>
.dialog-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

.border-subtle {
  border-color: #f1f5f9 !important;
}

.action-btn {
  background-color: #0f172a !important;
  color: #ffffff !important;
}

.compact-switch :deep(.v-selection-control) {
  min-height: 32px;
}

/* Ensure native calendar picker icon displays cleanly */
.custom-date-input :deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  cursor: pointer;
  filter: opacity(0.6);
}

.custom-date-input :deep(input[type="date"]::-webkit-calendar-picker-indicator:hover) {
  filter: opacity(1);
}
</style>
