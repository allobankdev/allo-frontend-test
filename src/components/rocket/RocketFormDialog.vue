<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  /** Existing rocket names (API + local) — used to validate that the new name is unique. */
  existingNames?: string[]
}>()

const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{ submit: [input: NewRocketInput] }>()

const formRef = ref()
const name = ref('')
const description = ref('')
const imageUrl = ref('')
const costPerLaunch = ref('')
const country = ref('')
const firstFlight = ref('')

// Guards against handleSubmit firing twice if "Tambah" is clicked rapidly before
// the async validate() call resolves and the dialog has a chance to close.
const isSubmitting = ref(false)

const nameRules = [
  (value: string) => !!value.trim() || 'Nama rocket wajib diisi',
  (value: string) => {
    const normalized = value.trim().toLowerCase()
    const isDuplicate = (props.existingNames ?? []).some(
      existing => existing.trim().toLowerCase() === normalized,
    )
    return !isDuplicate || 'Sudah ada rocket dengan nama ini'
  },
]

function resetForm () {
  name.value = ''
  description.value = ''
  imageUrl.value = ''
  costPerLaunch.value = ''
  country.value = ''
  firstFlight.value = ''
  formRef.value?.resetValidation()
}

// v-dialog can close by means other than the Batal button (outside click, Escape) —
// without this watcher, the form would keep a stale draft the next time it opens.
watch(model, isOpen => {
  if (!isOpen) resetForm()
})

async function handleSubmit () {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      name: name.value.trim(),
      description: description.value.trim() || null,
      imageUrl: imageUrl.value.trim() || null,
      // v-text-field always outputs a string — convert to a number explicitly rather than sending it raw.
      costPerLaunch: costPerLaunch.value === '' ? null : Number(costPerLaunch.value),
      country: country.value.trim() || null,
      firstFlight: firstFlight.value || null,
    })

    model.value = false
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel () {
  model.value = false
}
</script>

<template>
  <v-dialog
    v-model="model"
    max-width="520"
  >
    <v-card rounded="xl">
      <v-card-title class="font-weight-bold">
        Tambah Rocket
      </v-card-title>
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="name"
            class="mb-2"
            label="Nama rocket*"
            :rules="nameRules"
          />
          <v-textarea
            v-model="description"
            class="mb-2"
            label="Deskripsi"
            rows="3"
          />
          <v-text-field
            v-model="imageUrl"
            class="mb-2"
            label="URL gambar"
          />
          <v-text-field
            v-model="costPerLaunch"
            class="mb-2"
            label="Cost per launch (USD)"
            type="number"
          />
          <v-text-field
            v-model="country"
            class="mb-2"
            label="Country code (mis. USA)"
          />
          <v-text-field
            v-model="firstFlight"
            label="First flight"
            type="date"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="isSubmitting"
          variant="text"
          @click="handleCancel"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          variant="flat"
          @click="handleSubmit"
        >
          Tambah
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
