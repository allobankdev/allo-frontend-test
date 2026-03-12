<template>
  <v-dialog :model-value="modelValue" max-width="600" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-h5">Add New Rocket</v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[rules.required]"
            variant="outlined"
            rows="3"
            class="mb-2"
          />
          <v-text-field
            v-model="form.flickr_images"
            label="Image URL"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per Launch (USD)"
            type="number"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="form.first_flight"
            label="First Flight (YYYY-MM-DD)"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!valid" @click="submit">
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const store = useRocketStore()
const formRef = ref()
const valid = ref(false)

const rules = {
  required: (v: any) => !!v || 'This field is required',
}

const form = reactive({
  name: '',
  description: '',
  flickr_images: '',
  cost_per_launch: 0,
  country: '',
  first_flight: '',
})

function resetForm() {
  form.name = ''
  form.description = ''
  form.flickr_images = ''
  form.cost_per_launch = 0
  form.country = ''
  form.first_flight = ''
}

function close() {
  emit('update:modelValue', false)
  resetForm()
}

function submit() {
  const rocket: Rocket = {
    id: crypto.randomUUID(),
    name: form.name,
    description: form.description,
    flickr_images: [form.flickr_images],
    cost_per_launch: form.cost_per_launch,
    country: form.country,
    first_flight: form.first_flight,
    active: true,
    height: { meters: 0, feet: 0 },
    diameter: { meters: 0, feet: 0 },
    mass: { kg: 0, lb: 0 },
    stages: 1,
    wikipedia: '',
  }
  store.addRocket(rocket)
  close()
}
</script>
