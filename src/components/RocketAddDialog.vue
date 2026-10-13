<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
    persistent
  >
    <v-card class="add-rocket-dialog bg-surface text-white border-subtle">
      <!-- Dialog Header -->
      <v-card-item class="dialog-header pb-3 border-b">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="24"
              color="white"
            />
            <v-card-title class="text-h6 font-weight-bold px-0 text-white">
              Tambah Roket Baru
            </v-card-title>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="grey-lighten-1"
            @click="closeDialog"
          />
        </div>
        <p class="text-caption text-grey mt-1 mb-0">
          Roket yang ditambahkan akan langsung tampil pada sesi aplikasi saat ini.
        </p>
      </v-card-item>

      <!-- Form Content -->
      <v-card-text class="pt-4">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Rocket Full Name -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Nama Roket *"
                placeholder="Contoh: Falcon Heavy Block 6, Starship HLS"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                class="mb-1"
              />
            </v-col>

            <!-- Rocket Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Deskripsi Roket *"
                placeholder="Tuliskan spesifikasi, misi, atau ringkasan roket..."
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
                :rules="[rules.required]"
                class="mb-1"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="URL Gambar (Opsional)"
                placeholder="https://example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                class="mb-1"
              />
            </v-col>

            <!-- Image Preview if entered -->
            <v-col
              v-if="form.image_url"
              cols="12"
              class="mb-2"
            >
              <div class="preview-container">
                <span class="text-caption text-grey d-block mb-1">Pratinjau Gambar:</span>
                <v-img
                  :src="form.image_url"
                  max-height="140"
                  cover
                  class="rounded border-subtle bg-black"
                >
                  <template #error>
                    <div class="d-flex align-center justify-center fill-height bg-grey-darken-4 text-caption text-grey">
                      URL gambar tidak valid
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>

            <!-- Launch Cost -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Biaya Peluncuran (USD)"
                placeholder="Contoh: 50000000"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
                class="mb-1"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Kode Negara"
                placeholder="USA, IDN, dll."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
                class="mb-1"
              />
            </v-col>

            <!-- Maiden Flight -->
            <v-col cols="12">
              <v-text-field
                v-model="form.maiden_flight"
                label="Tanggal Penerbangan Pertama"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-outline"
                class="mb-1"
              />
            </v-col>

            <!-- Switches for Active & Reusable -->
            <v-col cols="6">
              <v-switch
                v-model="form.active"
                label="Status Aktif"
                color="white"
                density="compact"
                hide-details
              />
            </v-col>

            <v-col cols="6">
              <v-switch
                v-model="form.reusable"
                label="Dapat Digunakan Kembali (Reusable)"
                color="white"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Dialog Actions -->
      <v-card-actions class="px-6 pb-5 pt-2 border-t justify-end gap-2">
        <v-btn
          variant="outlined"
          color="grey-lighten-1"
          class="text-none font-weight-medium"
          @click="closeDialog"
        >
          Batal
        </v-btn>

        <v-btn
          variant="flat"
          color="white"
          class="text-black font-weight-bold text-none px-5"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Simpan Roket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import type { NewRocketPayload } from '@/types/rocket'

const emit = defineEmits<{
  (e: 'created', rocketId: string | number): void
}>()

const store = useRocketStore()
const isOpen = defineModel<boolean>({ default: false })
interface FormValidationRef {
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
}

const isFormValid = ref(false)
const formRef = ref<FormValidationRef | null>(null)

const defaultForm: NewRocketPayload = {
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
  reusable: true
}

const form = reactive<NewRocketPayload>({ ...defaultForm })

const rules = {
  required: (v: string) => !!(v && v.trim()) || 'Bidang ini wajib diisi'
}

function resetForm() {
  Object.assign(form, defaultForm)
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function closeDialog() {
  isOpen.value = false
  resetForm()
}

async function handleSubmit() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const created = store.addRocket({ ...form })
  emit('created', created.id)
  closeDialog()
}
</script>

<style scoped>
.add-rocket-dialog {
  background-color: #141416 !important;
  border-radius: 12px;
}

.border-subtle {
  border: 1px solid #27272a;
}

.border-b {
  border-bottom: 1px solid #27272a;
}

.border-t {
  border-top: 1px solid #27272a;
}

.gap-2 {
  gap: 0.75rem;
}

.preview-container {
  background: #0d0d0f;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px dashed #33333a;
}
</style>
