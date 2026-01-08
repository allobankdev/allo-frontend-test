<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const dialogVisible = ref(false)
const form = ref({
  name: '',
  description: '',
  country: '',
  first_flight: '',
  cost_per_launch: '',
  imageFile: null as File | null,
})

const preview = ref<string | null>(null)

const onFileChange = (file: File | File[] | null) => {
  const selected = Array.isArray(file) ? file[0] : file
  if (!selected) return

  form.value.imageFile = selected

  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result as string
  }
  reader.readAsDataURL(selected)
}

const submit = () => {
  if (!form.value.name || !form.value.description) return

  emit('submit', {
    ...form.value,
    imageBase64: preview.value, 
  })

  // reset
  form.value = {
    name: '',
    description: '',
    country: '',
    first_flight: '',
    cost_per_launch: '',
    imageFile: null,
  }
  preview.value = null
  dialogVisible.value = false
}
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="600">
    <template #activator="{ props }">
      <v-btn color="warning" v-bind="props" @click="dialogVisible = true">+ Add Rocket</v-btn>
    </template>

    <v-card>
      <v-card-title>Add Rocket</v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Name*" v-model="form.name" />
          </v-col>

          <v-col cols="6">
            <v-text-field label="Country" v-model="form.country" />
          </v-col>

          <v-col cols="12">
            <v-textarea label="Description*" v-model="form.description" />
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="First Flight"
              v-model="form.first_flight"
              type="date"
              :value="form.first_flight"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Cost per Launch"
              type="number"
              v-model="form.cost_per_launch"
            />
          </v-col>

          <!-- FILE INPUT -->
          <v-col cols="12">
            <v-file-input
              label="Rocket Image"
              accept="image/*"
              show-size
              @update:modelValue="onFileChange"
            />
          </v-col>

          <!-- PREVIEW -->
          <v-col cols="12" v-if="preview">
            <v-img :src="preview" height="200" cover class="rounded-lg" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="warning" @click="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
