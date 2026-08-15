<template>
  <v-dialog
    :model-value="modelValue"
    max-width="650"
    persistent
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <!-- Modal Header -->
      <v-card-item class="bg-surface-variant pa-4 border-b">
        <template #prepend>
          <v-avatar
            color="primary"
            size="36"
            class="mr-2"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              color="white"
            />
          </v-avatar>
        </template>
        <v-card-title class="text-h6 font-weight-bold">
          Add New Rocket
        </v-card-title>
        <v-card-subtitle>
          Add a custom rocket to the running application
        </v-card-subtitle>
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            aria-label="Close dialog"
            @click="handleClose"
          />
        </template>
      </v-card-item>

      <!-- Form Content -->
      <v-card-text class="pa-4 pa-sm-6">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Rocket Full Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.fullName"
                label="Rocket Full Name *"
                placeholder="e.g. Falcon Heavy Block 6"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required, rules.minLength(3)]"
                prepend-inner-icon="mdi-format-title"
                class="mb-2"
              />
            </v-col>

            <!-- Family & Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.family"
                label="Rocket Family"
                placeholder="e.g. Falcon, Starship"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-tag-outline"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.countryCode"
                label="Country Code"
                placeholder="e.g. USA, IDN"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
                class="mb-2"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.imageUrl"
                label="Image URL"
                placeholder="https://images.example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                hint="Leave empty to use a high-resolution space fallback image"
                persistent-hint
                class="mb-3"
              />
            </v-col>

            <!-- Cost Per Launch & Maiden Flight -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.launchCost"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 67000000"
                variant="outlined"
                density="comfortable"
                type="number"
                prepend-inner-icon="mdi-currency-usd"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.maidenFlight"
                label="First Flight Date"
                placeholder="YYYY-MM-DD"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-outline"
                class="mb-2"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description *"
                placeholder="Provide a detailed description of the launch vehicle, capabilities, and mission..."
                variant="outlined"
                density="comfortable"
                rows="3"
                :rules="[rules.required, rules.minLength(10)]"
                prepend-inner-icon="mdi-text"
                class="mb-2"
              />
            </v-col>

            <!-- Switches: Active & Reusable -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="formData.active"
                label="Active Launch Vehicle"
                color="success"
                density="compact"
                hide-details
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="formData.reusable"
                label="Reusable Rocket Stage"
                color="info"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          class="text-none"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-check"
          class="text-none font-weight-bold px-5"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Create Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { CreateRocketDto } from '@/types/rocket'
import { DEFAULT_MANUFACTURER_COUNTRY } from '@/utils/constants'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: CreateRocketDto]
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const isFormValid = ref(false)

const initialFormState = (): CreateRocketDto => ({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: DEFAULT_MANUFACTURER_COUNTRY,
  maidenFlight: '',
  family: 'SpaceX Custom',
  active: true,
  reusable: true,
})

const formData = reactive<CreateRocketDto>(initialFormState())

const rules = {
  required: (v: string) => Boolean(v?.trim()) || 'This field is required.',
  minLength: (min: number) => (v: string) => (v && v.trim().length >= min) || `Must be at least ${min} characters.`,
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    Object.assign(formData, initialFormState())
  }
})

function handleClose () {
  emit('update:modelValue', false)
}

async function handleSubmit () {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  emit('submit', {
    ...formData,
    fullName: formData.fullName.trim(),
    description: formData.description.trim(),
    imageUrl: formData.imageUrl?.trim() || undefined,
    countryCode: formData.countryCode?.trim() || DEFAULT_MANUFACTURER_COUNTRY,
    family: formData.family?.trim() || 'Custom',
  })

  handleClose()
}
</script>
