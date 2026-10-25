<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <v-card>
      <v-card-title>Tambah Roket Baru</v-card-title>
      <v-card-subtitle>
        Roket ini hanya akan muncul di aplikasi kamu saat ini (API bersifat read-only).
      </v-card-subtitle>

      <v-card-text>
        <v-form
          ref="formRef"
          v-model="isFormValid"
        >
          <v-text-field
            v-model="form.full_name"
            label="Nama roket *"
            :rules="[requiredRule]"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Deskripsi"
            rows="3"
            class="mb-2"
          />
          <v-text-field
            v-model="form.image_url"
            label="URL gambar"
            class="mb-2"
          />
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Biaya per peluncuran (USD)"
                type="number"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.country_code"
                label="Negara (mis. USA)"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.maiden_flight"
            label="Tanggal penerbangan pertama"
            type="date"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [value: NewRocketInput]
}>()

const emptyForm = (): NewRocketInput => ({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country_code: '',
})

const form = reactive<NewRocketInput>(emptyForm())
const formRef = ref()
const isFormValid = ref(false)

const requiredRule = (value: string) => !!value?.trim() || 'Nama roket wajib diisi'

// Reset the form each time the dialog opens, so leftover input from a
// previous "add" doesn't linger.
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) Object.assign(form, emptyForm())
  },
)

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', { ...form })
  close()
}
</script>
