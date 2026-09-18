<template>
  <v-dialog
    :model-value="modelValue"
    max-width="640"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card
      class="rounded-xl pa-2"
      elevation="10"
    >
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <div class="d-flex align-center">
          <v-avatar
            color="primary"
            class="mr-3"
            size="40"
          >
            <v-icon
              icon="mdi-rocket-launch"
              color="white"
            />
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold">
              Add New Rocket
            </h3>
            <span class="text-caption text-medium-emphasis">Local app addition (API is read-only)</span>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider class="my-3" />

      <v-card-text class="px-4 py-2">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="submitRocket"
        >
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Rocket Name *"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-format-title"
                required
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.family"
                label="Rocket Family"
                placeholder="e.g. Starship / Falcon"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-family-tree"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-earth"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch ($)"
                placeholder="e.g. 50000000"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight (YYYY-MM-DD)"
                placeholder="e.g. 2024-03-14"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL (optional)"
                placeholder="https://images.example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                hint="Leave empty to use automatic placeholder"
                persistent-hint
              />
            </v-col>

            <v-col
              cols="12"
              class="mt-2"
            >
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="Describe rocket specifications, missions, or details..."
                variant="outlined"
                rows="3"
                density="comfortable"
                prepend-inner-icon="mdi-text"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="my-2" />

      <v-card-actions class="px-4 py-3 justify-end gap-2">
        <v-btn
          variant="plain"
          class="text-none"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          class="text-none font-weight-bold px-6"
          prepend-icon="mdi-check"
          :disabled="!isFormValid || !form.full_name"
          @click="submitRocket"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { NewRocketPayload } from '@/types/rocket'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'addRocket', payload: NewRocketPayload): void
}>()

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: (v: string) => !!v?.trim() || 'Rocket name is required',
}

const form = reactive<NewRocketPayload>({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  family: 'Custom',
})

function closeDialog() {
  emit('update:modelValue', false)
  resetForm()
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = 'USA'
  form.maiden_flight = ''
  form.family = 'Custom'
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function submitRocket() {
  if (!form.full_name.trim()) return

  emit('addRocket', {
    full_name: form.full_name.trim(),
    description: form.description?.trim() || undefined,
    image_url: form.image_url?.trim() || undefined,
    launch_cost: form.launch_cost?.trim() || undefined,
    country_code: form.country_code?.trim() || 'USA',
    maiden_flight: form.maiden_flight?.trim() || undefined,
    family: form.family?.trim() || 'Custom',
  })

  closeDialog()
}
</script>
