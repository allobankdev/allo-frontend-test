<template>
  <v-dialog
    v-model="localDialog"
    max-width="640"
    persistent
    scrollable
  >
    <v-card class="add-rocket-dialog">
      <v-card-title class="text-h4 font-weight-light pa-6 pb-4">
        Add New Rocket
      </v-card-title>
      <v-card-text class="pa-6 pt-2">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[rules.required]"
            variant="outlined"
            rows="3"
            density="comfortable"
            class="mb-4"
          />
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.cost_per_launch"
                label="Cost per Launch"
                type="number"
                :rules="[rules.required, rules.positive]"
                variant="outlined"
                density="comfortable"
                prefix="$"
                hint="USD"
                persistent-hint
                class="mb-4"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country"
                label="Country"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.first_flight"
                label="First Flight"
                type="date"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                class="mb-4"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.active"
                label="Status"
                :items="statusOptions"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="[rules.required, rules.url]"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-6 pt-2">
        <v-spacer />
        <v-btn
          variant="text"
          size="large"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="outlined"
          size="large"
          :disabled="!valid"
          class="submit-btn"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Rocket } from '@/services/spacexApi'
import { useRocketStore } from '@/stores/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const rocketStore = useRocketStore()
const formRef = ref()
const valid = ref(false)

const form = ref({
  name: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: '',
  active: true,
  imageUrl: '',
})

const statusOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
]

const localDialog = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localDialog.value = newValue
  if (!newValue) {
    resetForm()
  }
})

watch(localDialog, (newValue) => {
  emit('update:modelValue', newValue)
})

const rules = {
  required: (value: any) => {
    if (value === null || value === undefined) return 'This field is required'
    if (typeof value === 'string' && !value.trim()) return 'This field is required'
    if (typeof value === 'boolean') return true
    return !!value || 'This field is required'
  },
  positive: (value: number) => value > 0 || 'Must be a positive number',
  url: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return 'Must be a valid URL'
    }
  },
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    cost_per_launch: 0,
    country: '',
    first_flight: '',
    active: true,
    imageUrl: '',
  }
  formRef.value?.resetValidation()
}

function handleCancel() {
  localDialog.value = false
}

function handleSubmit() {
  if (!valid.value) return

  const newRocket: Rocket = {
    id: `custom-${Date.now()}`,
    name: form.value.name,
    description: form.value.description,
    cost_per_launch: form.value.cost_per_launch,
    country: form.value.country,
    first_flight: form.value.first_flight,
    flickr_images: [form.value.imageUrl],
    active: form.value.active,
    type: 'Custom',
  }

  rocketStore.addRocket(newRocket)
  localDialog.value = false
}
</script>

<style scoped>
.add-rocket-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.add-rocket-dialog :deep(.v-card-title) {
  border-bottom: 1px solid rgba(var(--v-border-opacity), var(--v-border-opacity));
}

.add-rocket-dialog :deep(.v-field) {
  border-radius: 12px;
}

.add-rocket-dialog :deep(.v-field__input) {
  border-radius: 12px;
}

.add-rocket-dialog :deep(.v-select__selection) {
  border-radius: 12px;
}

.submit-btn {
  border-width: 1.5px;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: normal;
}

.submit-btn:disabled {
  opacity: 0.4;
}
</style>

