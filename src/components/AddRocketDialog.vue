<!--
  Fungsi: Modal form buat nambah roket baru ke state lokal (in-memory). Udah ada validasi
          nama wajib diisi, cek format URL gambar, sama biaya nggak boleh minus.
  v-model:
    - modelValue: atur buka/tutup modal
  Emits:
    - submit: kirim data roket baru yang udah lolos validasi
  Dipakai di:
    - src/pages/index.vue
-->

<script setup lang="ts">
import { ref } from 'vue'
import { isValidHttpUrl, type NewRocketInput } from '@/types/rocket'

const modelValue = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  submit: [payload: NewRocketInput]
}>()

const name = ref('')
const description = ref('')
const imageUrl = ref('')
const launchCost = ref('')
const countryCode = ref('USA')
const firstFlight = ref('')
const formError = ref<string | null>(null)

function resetForm() {
  name.value = ''
  description.value = ''
  imageUrl.value = ''
  launchCost.value = ''
  countryCode.value = 'USA'
  firstFlight.value = ''
  formError.value = null
}

function handleClose() {
  resetForm()
  modelValue.value = false
}

function handleSubmit() {
  const trimmedName = name.value.trim()
  if (!trimmedName) {
    formError.value = 'Rocket name is required.'
    return
  }

  const trimmedUrl = imageUrl.value.trim()
  if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
    formError.value = 'Image URL must start with http:// or https://'
    return
  }

  let parsedCost: number | null = null
  if (launchCost.value.trim() !== '') {
    parsedCost = Number(launchCost.value)
    if (Number.isNaN(parsedCost) || parsedCost < 0) {
      formError.value = 'Cost per launch must be a valid non-negative number.'
      return
    }
  }

  emit('submit', {
    name: trimmedName,
    description: description.value.trim() || null,
    imageUrl: trimmedUrl || null,
    launchCost: parsedCost,
    countryCode: countryCode.value.trim().toUpperCase() || null,
    firstFlight: firstFlight.value || null,
  })

  handleClose()
}
</script>

<template>
  <v-dialog
    v-model="modelValue"
    max-width="520"
    @after-leave="resetForm"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between pa-5 pb-3">
        <span class="text-h6 font-weight-bold">Add New Rocket</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleClose"
        />
      </v-card-title>

      <v-divider />

      <v-form @submit.prevent="handleSubmit">
        <v-card-text class="pa-5 d-flex flex-column ga-3">
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            density="compact"
          >
            {{ formError }}
          </v-alert>

          <v-text-field
            v-model="name"
            label="Rocket Name *"
            placeholder="e.g. Starship Block 3"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            required
          />

          <v-textarea
            v-model="description"
            label="Description"
            placeholder="Short description of the rocket..."
            variant="outlined"
            density="comfortable"
            rows="3"
            hide-details="auto"
          />

          <v-text-field
            v-model="imageUrl"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="launchCost"
                label="Cost per Launch (USD)"
                placeholder="e.g. 67000000"
                type="number"
                min="0"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="countryCode"
                label="Country Code"
                placeholder="e.g. USA"
                maxlength="10"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="firstFlight"
            label="First Flight"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 justify-end ga-2">
          <v-btn
            variant="outlined"
            @click="handleClose"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="#C2410C"
            variant="flat"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>