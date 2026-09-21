<template>
  <v-dialog
    v-model="isOpen"
    max-width="520"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6 pb-2 text-h6">
        Add New Rocket
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            variant="outlined"
            :rules="nameRules"
            class="mb-3"
            autofocus
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            rows="3"
            class="mb-3"
            no-resize
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            hint="Optional — leave blank for default image"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-2">
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

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const isOpen = defineModel<boolean>({ required: true })
const store = useRocketStore()

const formRef = ref()
const nameRules = [(v: string) => !!v?.trim() || 'Rocket name is required']

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
})

function resetForm() {
  Object.assign(form, { full_name: '', description: '', image_url: '' })
  formRef.value?.resetValidation()
}

function close() {
  isOpen.value = false
  resetForm()
}

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  store.addRocket(form)
  close()
}
</script>
