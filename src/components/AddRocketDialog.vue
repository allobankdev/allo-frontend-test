<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add New Rocket</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.name" label="Rocket Name*" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.description" label="Description*" required></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.country" label="Country"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.first_flight" type="date" label="First Flight"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model.number="form.cost_per_launch" type="number" label="Cost Per Launch ($)"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('update:modelValue', false)">
          Close
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" :disabled="!isFormValid" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', rocket: any): void
}>()

const form = reactive({
  name: '',
  description: '',
  country: '',
  first_flight: '',
  cost_per_launch: 0
})

const isFormValid = computed(() => !!form.name && !!form.description)

function save() {
  const newRocket = {
    id: 'manual-' + Date.now().toString(),
    name: form.name,
    description: form.description,
    country: form.country,
    first_flight: form.first_flight,
    cost_per_launch: form.cost_per_launch,
    flickr_images: []
  }
  emit('save', newRocket)
  
  // reset form quickly
  form.name = ''
  form.description = ''
  form.country = ''
  form.first_flight = ''
  form.cost_per_launch = 0
}
</script>
