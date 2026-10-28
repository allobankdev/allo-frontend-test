<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    scrollable
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>
          <v-icon icon="mdi-rocket-launch" class="mr-2" />
          Add New Rocket
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-toolbar>

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Rocket Name *"
                prepend-inner-icon="mdi-rocket"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                prepend-inner-icon="mdi-text"
                rows="3"
                variant="outlined"
                density="comfortable"
                hint="Optional"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                density="comfortable"
                hint="Optional – paste a direct image link"
                :rules="[rules.url]"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch (USD)"
                prepend-inner-icon="mdi-currency-usd"
                variant="outlined"
                density="comfortable"
                hint="Optional, e.g. 62000000"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                type="date"
                hint="Optional"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                prepend-inner-icon="mdi-flag"
                variant="outlined"
                density="comfortable"
                hint="Optional, e.g. USA"
                counter="3"
                maxlength="3"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-check"
          :disabled="!isFormValid"
          @click="submitForm"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  add: [data: {
    full_name: string
    description: string | null
    image_url: string | null
    launch_cost: string | null
    maiden_flight: string | null
    manufacturer: { name: string; country_code: string } | null
  }]
}>()

const dialog = ref(false)
const isFormValid = ref(false)
const formRef = ref<{ resetValidation: () => void } | null>(null)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country_code: '',
})

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
  url: (v: string) => {
    if (!v) return true // optional
    try {
      new URL(v)
      return true
    } catch {
      return 'Must be a valid URL'
    }
  },
}

function closeDialog() {
  dialog.value = false
  resetForm()
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.maiden_flight = ''
  form.country_code = ''
  formRef.value?.resetValidation()
}

function submitForm() {
  if (!isFormValid.value) return

  emit('add', {
    full_name: form.full_name.trim(),
    description: form.description?.trim() || null,
    image_url: form.image_url?.trim() || null,
    launch_cost: form.launch_cost?.trim() || null,
    maiden_flight: form.maiden_flight?.trim() || null,
    manufacturer: form.country_code?.trim()
      ? { name: 'Custom', country_code: form.country_code.trim().toUpperCase() }
      : null,
  })

  closeDialog()
}
</script>

