<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { RocketFormData } from '@/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: RocketFormData]
}>()

const dialog = ref(props.modelValue)
const formRef = ref()

const formData = reactive<RocketFormData>({
  name: '',
  description: '',
  flickr_images: [''],
  cost_per_launch: 0,
  country: '',
  first_flight: ''
})

const rules = {
  required: (v: string | number) => !!v || 'This field is required',
  positiveNumber: (v: number) => v >= 0 || 'Must be a positive number'
}

watch(() => props.modelValue, (val) => {
  dialog.value = val
})

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

function closeDialog() {
  dialog.value = false
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.description = ''
  formData.flickr_images = ['']
  formData.cost_per_launch = 0
  formData.country = ''
  formData.first_flight = ''
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (valid) {
    emit('submit', { ...formData })
  }
}

// Expose methods to parent
defineExpose({
  closeAndReset: closeDialog
})

function addImageUrl() {
  formData.flickr_images.push('')
}

function removeImageUrl(index: number) {
  formData.flickr_images.splice(index, 1)
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-rocket-launch" class="mr-2" />
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field v-model="formData.name" label="Rocket Name" :rules="[rules.required]" variant="outlined"
            class="mb-2" />

          <v-textarea v-model="formData.description" label="Description" :rules="[rules.required]" variant="outlined"
            rows="3" class="mb-2" />

          <v-text-field v-model="formData.country" label="Country" :rules="[rules.required]" variant="outlined"
            class="mb-2" />

          <v-text-field v-model.number="formData.cost_per_launch" label="Cost Per Launch (USD)" type="number"
            :rules="[rules.required, rules.positiveNumber]" variant="outlined" class="mb-2" />

          <v-text-field v-model="formData.first_flight" label="First Flight Date" type="date" :rules="[rules.required]"
            variant="outlined" class="mb-2" />

          <div class="mb-2">
            <label class="text-subtitle-2 text-medium-emphasis">Image URLs</label>
            <div v-for="(_, index) in formData.flickr_images" :key="index" class="d-flex align-center gap-2 mt-2">
              <v-text-field v-model="formData.flickr_images[index]" :label="`Image URL ${index + 1}`" variant="outlined"
                density="compact" hide-details class="flex-grow-1" />
              <v-btn v-if="formData.flickr_images.length > 1" icon="mdi-delete" variant="text" color="error"
                size="small" @click="removeImageUrl(index)" />
            </div>
            <v-btn variant="text" color="primary" size="small" class="mt-2" @click="addImageUrl">
              <v-icon icon="mdi-plus" start />
              Add Image URL
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleSubmit">
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
