<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { Rocket } from '@/types/rocket'

const emit = defineEmits<{
  add: [rocket: Rocket]
}>()

const dialog = ref(false)
const formRef = ref<VForm | null>(null)
const snackbar = ref(false)

const form = ref({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: null as number | null,
  country_code: '',
  maiden_flight: '',
})

const requiredRule = (value: string) => Boolean(value?.trim()) || 'This field is required'

const urlRule = (value: string) => {
  if (!value) return true

  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a valid URL'
  }
}

const canSubmit = computed(() => form.value.full_name.trim() && form.value.description.trim())

function resetForm() {
  form.value = {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: null,
    country_code: '',
    maiden_flight: '',
  }

  formRef.value?.resetValidation()
}

async function submitRocket() {
  const result = await formRef.value?.validate()

  if (!result?.valid) return

  const rocket: Rocket = {
    id: `local-${Date.now()}`,
    full_name: form.value.full_name.trim(),
    description: form.value.description.trim(),
    image_url: form.value.image_url.trim() || null,
    launch_cost: form.value.launch_cost,
    maiden_flight: form.value.maiden_flight || null,
    manufacturer: {
      country_code: form.value.country_code.trim().toUpperCase() || null,
    },
  }

  emit('add', rocket)

  snackbar.value = true
  resetForm()
  dialog.value = false
}
</script>

<template>
  <v-btn
    color="primary"
    prepend-icon="mdi-plus"
    @click="dialog = true"
  >
    Add Rocket
  </v-btn>

  <v-dialog
    v-model="dialog"
    max-width="640"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h5">
        Add Temporary Rocket
      </v-card-title>

      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          This rocket will only appear while the app is running because the API is read-only.
        </p>

        <v-form
          ref="formRef"
          @submit.prevent="submitRocket"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket name"
            variant="outlined"
            :rules="[requiredRule]"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            :rules="[requiredRule]"
            rows="3"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            :rules="[urlRule]"
            class="mb-3"
          />

          <v-text-field
            v-model.number="form.launch_cost"
            label="Launch cost"
            type="number"
            min="0"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country code"
            placeholder="US"
            variant="outlined"
            maxlength="2"
            class="mb-3"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="Maiden flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click="resetForm(); dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!canSubmit"
          @click="submitRocket"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    timeout="2500"
  >
    Rocket added successfully.
  </v-snackbar>
</template>