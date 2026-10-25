<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
  >
    <v-card>
      <v-card-title class="text-h5 pa-6">
        Add New Rocket
      </v-card-title>

      <v-card-text class="px-6">
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket name"
            variant="outlined"
            :error-messages="errors.full_name"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            :error-messages="errors.description"
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.launch_cost"
            label="Launch cost"
            type="number"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country code"
            variant="outlined"
            placeholder="US"
            class="mb-2"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />

        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          :loading="isSubmitting"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const rocketStore = useRocketStore()

const isSubmitting = ref(false)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: null as number | null,
  country_code: '',
  maiden_flight: '',
})

const errors = reactive({
  full_name: '',
  description: '',
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = null
  form.country_code = ''
  form.maiden_flight = ''

  errors.full_name = ''
  errors.description = ''
}

function close() {
  resetForm()
  isOpen.value = false
}

function validate() {
  errors.full_name = ''
  errors.description = ''

  if (!form.full_name.trim()) {
    errors.full_name = 'Rocket name is required.'
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required.'
  }

  return !errors.full_name && !errors.description
}

function submit() {
  if (!validate()) {
    return
  }

  isSubmitting.value = true

  const newRocket = {
    id: Date.now(),
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      name: null,
      country_code: form.country_code.trim() || null,
    },
  }

  rocketStore.addRocket(newRocket)

  isSubmitting.value = false
  close()
}
</script>