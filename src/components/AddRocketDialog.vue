<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
    persistent
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
        class="font-weight-bold rounded-lg px-4 text-black"
        elevation="2"
      >
        Tambah Roket
      </v-btn>
    </template>

    <v-card class="rounded-xl overflow-hidden elevation-10">
      <v-card-item class="bg-primary text-black py-4 px-6">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center ga-3">
            <v-avatar
              color="black"
              size="36"
            >
              <v-icon
                icon="mdi-rocket-launch"
                color="primary"
                size="20"
              />
            </v-avatar>
            <div>
              <v-card-title class="text-h6 font-weight-bold text-black pa-0">
                Tambah Roket Baru
              </v-card-title>
              <span class="text-caption text-black font-weight-medium">
                Data akan tersimpan secara lokal pada sesi aplikasi ini
              </span>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="black"
            density="comfortable"
            @click="closeDialog"
          />
        </div>
      </v-card-item>

      <v-form
        ref="formRef"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Nama Lengkap Roket *"
                placeholder="Contoh: Falcon Heavy Extended"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-rocket"
                :rules="[rules.required]"
                class="mb-2"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Deskripsi Roket"
                placeholder="Tuliskan spesifikasi atau informasi singkat roket..."
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
                prepend-inner-icon="mdi-text-box-outline"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Biaya Peluncuran (USD)"
                placeholder="Contoh: 90000000"
                variant="outlined"
                density="comfortable"
                prefix="$"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[rules.numeric]"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Kode Negara Manufaktur"
                placeholder="Contoh: USA / IDN"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="Penerbangan Perdana"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-start"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.image_url"
                label="URL Gambar Roket"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                class="mb-2"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 bg-surface-light d-flex justify-end ga-2">
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="px-4"
            @click="closeDialog"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="px-6 font-weight-bold rounded-lg text-black"
            type="submit"
            :disabled="!isFormValid"
          >
            Simpan Roket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import type { CreateRocketPayload } from '@/types/rocket'

const emit = defineEmits<{
  (e: 'created'): void
}>()

const rocketStore = useRocketStore()
const isOpen = ref(false)
const isFormValid = ref(false)
const formRef = ref()

const initialForm = (): CreateRocketPayload => ({
  full_name: '',
  description: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  image_url: '',
})

const form = reactive<CreateRocketPayload>(initialForm())

const rules = {
  required: (v: string) => !!v?.trim() || 'Field ini wajib diisi',
  numeric: (v: string) => {
    if (!v) return true
    return !isNaN(Number(v)) || 'Harus berupa angka valid'
  },
}

function closeDialog() {
  isOpen.value = false
  Object.assign(form, initialForm())
  formRef.value?.resetValidation()
}

function handleSubmit() {
  if (!form.full_name.trim()) return

  rocketStore.addRocket({
    full_name: form.full_name.trim(),
    description: form.description?.trim(),
    launch_cost: form.launch_cost ? Number(form.launch_cost) : undefined,
    country_code: form.country_code?.trim() || 'USA',
    maiden_flight: form.maiden_flight,
    image_url: form.image_url?.trim(),
  })

  emit('created')
  closeDialog()
}
</script>
