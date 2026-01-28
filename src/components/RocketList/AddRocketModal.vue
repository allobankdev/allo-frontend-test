<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            required
            class="form-field"
          />
          <v-text-field
            v-model="form.type"
            label="Type"
            required
            class="form-field"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            required
            rows="3"
            class="form-field"
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost Per Launch"
            type="number"
            required
            class="form-field"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            required
            class="form-field"
          />
          <v-text-field
            v-model="form.first_flight"
            label="First Flight (YYYY-MM-DD)"
            required
            class="form-field"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            class="form-field"
          />
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Rocket } from '@/stores/rocketStore'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', rocket: Rocket): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  type: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: '',
  imageUrl: '',
})

const handleSubmit = () => {
  if (!form.value.name || !form.value.description) {
    alert('Please fill in all required fields')
    return
  }

  const rocket: Rocket = {
    id: `custom-${Date.now()}`,
    name: form.value.name,
    type: form.value.type,
    description: form.value.description,
    cost_per_launch: form.value.cost_per_launch,
    country: form.value.country,
    first_flight: form.value.first_flight,
    rocket_id: `custom-${Date.now()}`,
    flickr_images: form.value.imageUrl ? [form.value.imageUrl] : [],
  }

  emit('submit', rocket)
  resetForm()
  emit('update:modelValue', false)
}

const handleCancel = () => {
  resetForm()
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.value = {
    name: '',
    type: '',
    description: '',
    cost_per_launch: 0,
    country: '',
    first_flight: '',
    imageUrl: '',
  }
}
</script>

<style scoped>
.form-field {
  margin-bottom: 16px;
}
</style>
