<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    persistent
    @update:model-value="onModelUpdate"
  >
    <v-card>
      <v-card-title class="text-h6">
        Add new rocket
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Rocket name"
          variant="outlined"
          density="comfortable"
          class="mb-2"
          hide-details
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          variant="outlined"
          density="comfortable"
          rows="3"
          class="mb-2"
          hide-details
        />
        <v-text-field
          v-model="form.country"
          label="Country (optional)"
          variant="outlined"
          density="comfortable"
          class="mb-2"
          hide-details
        />
        <v-text-field
          v-model="form.first_flight"
          label="First flight (optional)"
          variant="outlined"
          density="comfortable"
          placeholder="YYYY-MM-DD"
          hide-details
        />
        <v-text-field
          v-model.number="form.cost_per_launch"
          label="Cost per launch (optional)"
          type="number"
          variant="outlined"
          density="comfortable"
          class="mt-2"
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!form.name.trim()"
          @click="submit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { RocketInput } from '@/types/rocket'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; add: [input: RocketInput] }>()

function onModelUpdate(v: boolean) {
  emit('update:modelValue', v)
  if (!v) reset()
}

const form = reactive<RocketInput & { cost_per_launch?: number }>({
  name: '',
  description: '',
  country: '',
  first_flight: '',
  cost_per_launch: undefined,
})

function reset() {
  form.name = ''
  form.description = ''
  form.country = ''
  form.first_flight = ''
  form.cost_per_launch = undefined
}

function submit() {
  if (!form.name.trim()) return
  emit('add', {
    name: form.name.trim(),
    description: form.description?.trim() ?? '',
    country: form.country?.trim() ?? '',
    first_flight: form.first_flight?.trim() || null,
    cost_per_launch: form.cost_per_launch ?? null,
  })
  emit('update:modelValue', false)
  reset()
}
</script>
