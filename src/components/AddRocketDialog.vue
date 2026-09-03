<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit'])

const isOpen = defineModel({ type: Boolean, default: false })

const formRef = ref(null)
const isFormValid = ref(false)

const initialFormState = () => ({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: '',
  firstFlight: '',
})

const form = reactive(initialFormState())

const nameRules = [(value) => !!value?.trim() || 'Rocket name is required']
const urlRules = [
  (value) => !value || /^https?:\/\/.+/i.test(value) || 'Must be a valid URL starting with http(s)://',
]

function resetForm() {
  Object.assign(form, initialFormState())
  formRef.value?.resetValidation()
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', { ...form })
  resetForm()
  isOpen.value = false
}

function handleCancel() {
  resetForm()
  isOpen.value = false
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="560" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Add a new rocket</span>
        <v-btn icon="mdi-close" variant="text" density="comfortable" @click="handleCancel" />
      </v-card-title>

      <v-divider />

      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Rocket name *"
            :rules="nameRules"
            variant="outlined"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="urlRules"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch"
            placeholder="e.g. 6.7 million"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            placeholder="e.g. USA"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="handleCancel">Cancel</v-btn>
          <v-btn color="primary" type="submit">Add rocket</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
