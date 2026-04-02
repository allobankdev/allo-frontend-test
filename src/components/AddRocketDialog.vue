<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        v-bind="props"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h5">New Rocket</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submit"
        >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newRocket.name"
                  label="Rocket Name"
                  required
                  :rules="[requiredRule]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="newRocket.description"
                  label="Description"
                  required
                  :rules="[requiredRule]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newRocket.country"
                  label="Country"
                  required
                  :rules="[requiredRule]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="newRocket.cost_per_launch"
                  label="Cost per Launch"
                  type="number"
                  required
                  :rules="[requiredRule, positiveNumberRule]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newRocket.first_flight"
                  label="First Flight (YYYY-MM-DD)"
                  type="date"
                  required
                  :rules="[requiredRule]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="imageUrl"
                  label="Image URL (Optional)"
                  placeholder="https://..."
                  :rules="[imageUrlRule]"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          :disabled="submitting"
          :loading="submitting"
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'

import { useRocketStore, type Rocket } from '@/stores/rocketStore'

const dialog = ref(false)
const valid = ref(false)
const submitting = ref(false)
const form = ref<VForm | null>(null)
const store = useRocketStore()

const imageUrl = ref('')
const newRocket = reactive({
  name: '',
  description: '',
  country: '',
  cost_per_launch: 0,
  first_flight: '',
})

const requiredRule = (value: string | number) => Boolean(value) || 'This field is required'
const positiveNumberRule = (value: number) => value > 0 || 'Must be greater than 0'
const imageUrlRule = (value: string) => {
  if (!value) {
    return true
  }

  try {
    new URL(value)
    return true
  } catch {
    return 'Image URL must be valid'
  }
}

const resetForm = () => {
  imageUrl.value = ''
  valid.value = false
  Object.assign(newRocket, {
    name: '',
    description: '',
    country: '',
    cost_per_launch: 0,
    first_flight: '',
  })
  form.value?.resetValidation()
}

const close = () => {
  dialog.value = false
  setTimeout(() => {
    resetForm()
  }, 300)
}

const submit = async () => {
  submitting.value = true
  const result = await form.value?.validate()

  if (!result?.valid) {
    submitting.value = false
    return
  }

  const rocket: Rocket = {
    id: crypto.randomUUID(),
    ...newRocket,
    flickr_images: imageUrl.value ? [imageUrl.value] : [],
  }

  store.addRocket(rocket)
  submitting.value = false
  close()
}
</script>
