<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        color="primary"
        v-bind="activatorProps"
        size="large"
      >
        <v-icon start>mdi-plus</v-icon>
        Add New Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 pa-4">
        Add New Rocket
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Rocket Name*"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description*"
            :rules="[rules.required]"
            variant="outlined"
            rows="4"
            class="mb-3"
          />

          <v-text-field
            v-model="form.country"
            label="Country*"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per Launch (USD)*"
            :rules="[rules.required, rules.number]"
            type="number"
            variant="outlined"
            prefix="$"
            class="mb-3"
          />

          <v-text-field
            v-model="form.first_flight"
            label="First Flight Date*"
            :rules="[rules.required]"
            type="date"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            placeholder="https://example.com/image.jpg"
            class="mb-3"
          />

          <v-alert
            v-if="form.image_url"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            <template #prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            Preview will appear after submission
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
          :disabled="submitting"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="submitting"
          :disabled="!valid"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketsStore } from '@/stores/rockets'

const dialog = ref(false)
const valid = ref(false)
const submitting = ref(false)
const formRef = ref()

const rocketsStore = useRocketsStore()

const form = reactive({
  name: '',
  description: '',
  country: '',
  cost_per_launch: 0,
  first_flight: '',
  image_url: '',
})

const rules = {
  required: (v: string) => !!v || 'This field is required',
  number: (v: number) => v > 0 || 'Must be a positive number',
}

async function handleSubmit() {
  if (!formRef.value) return

  const { valid: isValid } = await formRef.value.validate()

  if (!isValid) return

  submitting.value = true

  try {
    await rocketsStore.addRocket({
      name: form.name,
      description: form.description,
      country: form.country,
      cost_per_launch: form.cost_per_launch,
      first_flight: form.first_flight,
      flickr_images: form.image_url ? [form.image_url] : [],
    })

    closeDialog()
    resetForm()
  } catch (error) {
    console.error('Failed to add rocket:', error)
  } finally {
    submitting.value = false
  }
}

function closeDialog() {
  dialog.value = false
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.country = ''
  form.cost_per_launch = 0
  form.first_flight = ''
  form.image_url = ''
  formRef.value?.reset()
}
</script>
