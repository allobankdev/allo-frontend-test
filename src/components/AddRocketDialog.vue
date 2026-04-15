<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="px-4"
        variant="tonal"
        size="xx-large"
        prepend-icon="mdi-plus"
      >
        Add New Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">Add New Rocket</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            :rules="[(v) => !!v || 'Description is required']"
            required
          />
          <div class="grid grid-cols-2 gap-3">
            <v-text-field
              v-model.number="form.cost_per_launch"
              label="Cost per Launch ($)"
              type="number"
              min="0"
            />
            <v-text-field v-model="form.country" label="Country" />
          </div>
          <v-text-field
            v-model="form.first_flight"
            label="First Flight"
            type="date"
          />
          <v-text-field
            v-model="form.image"
            label="Image URL (optional)"
            placeholder="https://..."
          />
          <v-switch
            v-model="form.active"
            color="success"
            label="Active"
            hide-details
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="submitting">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          :loading="submitting"
          :disabled="!valid"
          @click="handleSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { NewRocker } from '@/services/types'
import { useRocketStore } from '@/stores/store'
import { ref } from 'vue'

const rocketStore = useRocketStore()

const dialog = ref(false)
const valid = ref(false)
const submitting = ref(false)
const formRef = ref<any>(null)

type FormState = Omit<NewRocker, 'flickr_images'> & { image: string }

const defaultForm = (): FormState => ({
  name: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: '',
  image: '',
  active: true,
})

const form = ref<FormState>(defaultForm())

const close = () => {
  dialog.value = false
  form.value = defaultForm()
  formRef.value?.resetValidation?.()
}

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return
  submitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const payload: NewRocker = {
      name: form.value.name,
      description: form.value.description,
      cost_per_launch: Number(form.value.cost_per_launch) || 0,
      country: form.value.country,
      first_flight: form.value.first_flight,
      active: form.value.active,
      flickr_images: form.value.image ? [form.value.image] : [],
    }
    rocketStore.addLocalRocket(payload)
    close()
  } finally {
    submitting.value = false
  }
}
</script>
