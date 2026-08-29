<template>
  <v-dialog
    v-model="localDialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            :rules="[rules.required]"
            required
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[rules.required]"
            required
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.cost_per_launch"
            label="Cost per Launch"
            type="number"
            :rules="[rules.required, rules.positive]"
            prefix="$"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="form.country"
            label="Country"
            :rules="[rules.required]"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="form.first_flight"
            label="First Flight Date"
            :rules="[rules.required]"
            hint="Format: YYYY-MM-DD"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="imageUrl"
            label="Image URL"
            hint="Enter image URL (optional)"
            class="mb-2"
            @keyup.enter="addImage"
          />

          <v-btn
            v-if="imageUrl"
            color="primary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-plus"
            @click="addImage"
          >
            Add Image
          </v-btn>

          <v-chip
            v-for="(image, index) in form.flickr_images"
            :key="index"
            closable
            class="ma-1"
            @click:close="removeImage(index)"
          >
            Image {{ index + 1 }}
          </v-chip>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          :disabled="!valid"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RocketFormData } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: RocketFormData]
}>()

const formRef = ref()
const valid = ref(false)
const imageUrl = ref('')

const form = ref<RocketFormData>({
  name: '',
  description: '',
  flickr_images: [],
  cost_per_launch: 0,
  country: '',
  first_flight: '',
})

const rules = {
  required: (value: any) => !!value || 'This field is required',
  positive: (value: number) => value > 0 || 'Must be a positive number',
}

const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    name: '',
    description: '',
    flickr_images: [],
    cost_per_launch: 0,
    country: '',
    first_flight: '',
  }
  imageUrl.value = ''
  formRef.value?.resetValidation()
}

function addImage() {
  if (imageUrl.value.trim()) {
    form.value.flickr_images.push(imageUrl.value.trim())
    imageUrl.value = ''
  }
}

function removeImage(index: number) {
  form.value.flickr_images.splice(index, 1)
}

function closeDialog() {
  localDialog.value = false
}

function handleSubmit() {
  if (formRef.value?.validate()) {
    emit('submit', {
      ...form.value,
      cost_per_launch: Number(form.value.cost_per_launch),
    })
    closeDialog()
  }
}
</script>

