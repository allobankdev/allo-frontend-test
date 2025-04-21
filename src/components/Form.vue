<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="600"
  >
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-form 
        ref="form" 
        v-model="isFormValid"
      >
        <v-card-text>
          <v-text-field
            v-model="rocket.name"
            label="Name"
            :rules="[requiredRule]"
          />
          <v-textarea
            v-model="rocket.description"
            label="Description"
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="rocket.cost_per_launch"
            label="Cost"
            type="number"
            :rules="[requiredRule,numberRule]"
          />
          <v-text-field
            v-model="rocket.country"
            label="Country"
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="rocket.first_flight"
            label="First Flight"
            :rules="[requiredRule]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="handleClose"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="submitForm"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

interface RocketFormData {
    name: string
    description: string
    cost_per_launch: number
    country: string
    first_flight: string
}

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: RocketFormData): void
    (e: 'close'): void
}>()

const isOpen = ref(props.modelValue)
const form = ref()
const isFormValid = ref(false)
const requiredRule = (v: string) => (!!v && v.trim().length > 0) || 'This field is required'
const numberRule = (v: number) => (!isNaN(Number(v)) && Number(v) > 0) || 'Enter a valid number'
const rocket = ref<RocketFormData>({
  name: '',
  description: '',
  cost_per_launch: '',
  country: '',
  first_flight: '',
})

function submitForm() {
  form.value.validate()
  if (isFormValid.value) {
        emit('submit', rocket.value)
        isOpen.value = false
    }
}

function handleClose() {
  emit('close')
  isOpen.value = false
}

function resetForm() {
  rocket.value = {
    name: '',
    description: '',
    cost_per_launch: '',
    country: '',
    first_flight: '',
  }
  form.value?.resetValidation()
}

watch(
    () => props.modelValue,
    (val) => {
        isOpen.value = val
        resetForm()
    }
)

watch(isOpen, (val) => emit('update:modelValue', val))
</script>
