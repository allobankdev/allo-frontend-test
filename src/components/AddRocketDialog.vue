<template>
  <v-dialog
    v-model="model"
    max-width="500"
    scrollable
  >
    <v-card title="Add New Rocket">
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            label="Rocket Name *"
            variant="outlined"
            class="mb-2"
            :rules="[required('Name')]"
          />
          <v-textarea
            v-model="form.description"
            label="Description *"
            variant="outlined"
            rows="3"
            class="mb-2"
            :rules="[required('Description')]"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            variant="outlined"
            class="mb-2"
            :rules="[urlRule]"
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost Per Launch (USD)"
            type="number"
            min="0"
            variant="outlined"
            class="mb-2"
            :rules="[nonNegativeRule]"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.first_flight"
            label="First Flight (YYYY-MM-DD)"
            placeholder="YYYY-MM-DD"
            variant="outlined"
            class="mb-2"
            :rules="[dateRule]"
          />
          <v-switch
            v-model="form.active"
            label="Active"
            color="success"
            inset
            hide-details
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          type="submit"
          @click="submit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import type { Rocket } from '@/types/rocket'

const model = defineModel<boolean>()

const emit = defineEmits<{
  add: [rocket: Omit<Rocket, 'id' | 'isLocal'>]
}>()

type FormState = {
  name: string
  description: string
  imageUrl: string
  cost_per_launch: number | null
  country: string
  first_flight: string
  active: boolean
}

const defaultForm = (): FormState => ({
  name: '',
  description: '',
  imageUrl: '',
  cost_per_launch: null,
  country: '',
  first_flight: '',
  active: true,
})

const form = reactive<FormState>(defaultForm())
const formRef = ref<InstanceType<typeof VForm> | null>(null)

const required = (label: string) => (v: string) =>
  (!!v && v.trim() !== '') || `${label} is required`

const urlRule = (v: string) => {
  if (!v) return true
  try {
    const url = new URL(v)
    return url.protocol === 'http:' || url.protocol === 'https:' || 'Must be a valid http(s) URL'
  } catch {
    return 'Must be a valid URL'
  }
}

const dateRule = (v: string) => {
  if (!v) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Use YYYY-MM-DD format'
  const date = new Date(v)
  return !Number.isNaN(date.getTime()) || 'Invalid date'
}

const nonNegativeRule = (v: number | null) =>
  v == null || v >= 0 || 'Cost cannot be negative'

async function submit () {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  emit('add', {
    name: form.name.trim(),
    description: form.description.trim(),
    flickr_images: form.imageUrl ? [form.imageUrl] : [],
    cost_per_launch: form.cost_per_launch,
    country: form.country.trim(),
    first_flight: form.first_flight,
    active: form.active,
  })
  close()
}

function close () {
  Object.assign(form, defaultForm())
  formRef.value?.resetValidation()
  model.value = false
}

watch(model, value => {
  if (value) {
    Object.assign(form, defaultForm())
    formRef.value?.resetValidation()
  }
})
</script>
