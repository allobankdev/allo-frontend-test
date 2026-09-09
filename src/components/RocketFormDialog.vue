<script setup lang="ts">
import { reactive, ref } from 'vue'
import {VForm} from 'vuetify/components'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'submit',
])

const form = reactive({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  manufacturer_name: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const nameRules = [
  (value: string) => {
    return value?.trim()
      ? true
      : 'Rocket Name wajib diisi'
  },
]

const close = () => {
  emit('update:modelValue', false)
}

const submit = async () => {
  if (!formRef.value) return
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  emit('submit', {
    name: form.name,
    full_name: form.full_name,
    description: form.description,
    image_url: form.image_url,
    launch_cost: form.launch_cost || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: { name: form.manufacturer_name, country_code: form.country_code,},
  })

  form.name = ''
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.manufacturer_name = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''

  close()
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        Add Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            variant="outlined"
            class="mb-3"
            :rules="nameRules"
          />

          <v-text-field
            v-model="form.full_name"
            label="Full Name"
            variant="outlined"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.manufacturer_name"
            label="Manufacturer"
            placeholder="SpaceX"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
          />
          <v-text-field
            v-model="form.launch_cost"
            label="Launch Cost (USD)"
            type="number"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country Code"
            placeholder="USA"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="Maiden Flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>