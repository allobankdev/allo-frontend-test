<template>
  <v-dialog :model-value="modelValue" max-width="600" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-rocket-launch-outline" color="primary" />
          <span class="text-h6 font-weight-bold">Add New Rocket</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-card-text class="pa-4 ga-3 d-flex flex-column">
          <v-text-field
            v-model="form.name"
            label="Rocket Name *"
            placeholder="e.g. Falcon Heavy Block 6"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
          />

          <v-textarea
            v-model="form.description"
            label="Rocket Description *"
            placeholder="Provide a detailed description of the rocket..."
            variant="outlined"
            density="comfortable"
            rows="3"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg (optional)"
            variant="outlined"
            density="comfortable"
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launchCost"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 50000000"
                variant="outlined"
                density="comfortable"
                type="number"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maidenFlight"
            label="First Flight Date"
            placeholder="YYYY-MM-DD"
            variant="outlined"
            density="comfortable"
            type="date"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 ga-2 justify-end">
          <v-btn variant="text" @click="close">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" type="submit">
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: NewRocketInput): void
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive<NewRocketInput>({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: 'USA',
  maidenFlight: '',
})

const rules = {
  required: (v: string) => (!!v && v.trim().length > 0) || 'This field is required',
}

function reset(): void {
  form.name = ''
  form.description = ''
  form.imageUrl = ''
  form.launchCost = ''
  form.country = 'USA'
  form.maidenFlight = ''
}

function close(): void {
  reset()
  emit('update:modelValue', false)
}

async function handleSubmit(): Promise<void> {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  emit('submit', { ...form })
  close()
}
</script>
