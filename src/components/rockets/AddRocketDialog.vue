<!--
  AddRocketDialog.vue
  Modal form for adding a new rocket to the local list.
  The API is read-only, so the rocket is stored only in the Pinia store
  for the current session.
-->
<template>
  <v-dialog v-model="isOpen" max-width="560" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-6 pb-2">
        <v-icon class="mr-2" color="primary">mdi-rocket-launch</v-icon>
        Add New Rocket
      </v-card-title>

      <v-card-text class="pa-6 pt-2">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket name *"
            placeholder="e.g. Falcon 9 v1.2"
            :rules="[required]"
            variant="outlined"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Describe the rocket..."
            variant="outlined"
            rows="3"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            :rules="[optionalUrl]"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="primary" variant="elevated" @click="submit">Add Rocket</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  (
    e: 'add',
    payload: { full_name: string; description: string | null; image_url: string | null }
  ): void
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
})

// ─── Validation rules ──────────────────────────────────────────────────────

function required(v: string) {
  return v.trim().length > 0 || 'This field is required.'
}

function optionalUrl(v: string) {
  if (!v.trim()) return true
  try {
    new URL(v.trim())
    return true
  } catch {
    return 'Please enter a valid URL.'
  }
}

// ─── Actions ───────────────────────────────────────────────────────────────

async function submit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('add', {
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
  })

  resetForm()
  isOpen.value = false
}

function cancel() {
  resetForm()
  isOpen.value = false
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  formRef.value?.validate()
}
</script>
