<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="520" 
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="pt-5 px-6">
        Add New Rocket
      </v-card-title>
      <v-card-subtitle class="px-6">
        This rocket will only be visible in the current session.
      </v-card-subtitle>

      <v-form 
        ref="formRef" 
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="px-6">
          <v-text-field
            v-model="form.full_name"
            label="Rocket name *"
            :rules="[requiredRule]"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://…"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>

        <v-card-actions class="px-6 pb-5">
          <v-spacer />
          <v-btn 
            variant="text" 
            @click="handleCancel"
          >
            Cancel
          </v-btn>
          <v-btn 
            type="submit" 
            color="primary" 
            variant="flat"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { NewRocketForm } from '@/types/rocket'

const emit = defineEmits<{
  submit: [form: NewRocketForm]
}>()

const isOpen = ref(false)
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const EMPTY_FORM = (): NewRocketForm => ({
  full_name: '',
  description: '',
  image_url: '',
})

const form = reactive<NewRocketForm>(EMPTY_FORM())

const requiredRule = (value: string) => !!value?.trim() || 'This field is required.'

async function handleSubmit(): Promise<void> {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  emit('submit', { ...form })
  resetAndClose()
}

function handleCancel(): void {
  resetAndClose()
}

function resetAndClose(): void {
  Object.assign(form, EMPTY_FORM())
  isOpen.value = false
}
</script>
