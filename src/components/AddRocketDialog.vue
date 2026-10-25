<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
      >
        Tambah Roket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="text-h6 pa-6 pb-2">
        <v-icon
          icon="mdi-rocket-launch"
          class="mr-2"
        />
        Tambah Roket Baru
      </v-card-title>

      <v-card-text class="px-6">
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="form.full_name"
            :rules="[rules.required]"
            class="mb-2"
            label="Nama Roket *"
            prepend-inner-icon="mdi-rocket"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Deskripsi"
            prepend-inner-icon="mdi-text"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.image_url"
            class="mb-2"
            label="URL Gambar"
            prepend-inner-icon="mdi-image"
            variant="outlined"
          />

          <v-text-field
            v-model="form.launch_cost"
            class="mb-2"
            label="Biaya Peluncuran"
            placeholder="contoh: 50000000"
            prepend-inner-icon="mdi-currency-usd"
            variant="outlined"
          />

          <v-text-field
            v-model="form.country_code"
            class="mb-2"
            label="Kode Negara"
            placeholder="contoh: USA"
            prepend-inner-icon="mdi-flag"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maiden_flight"
            class="mb-2"
            label="Penerbangan Pertama"
            placeholder="contoh: 2024-01-15"
            prepend-inner-icon="mdi-calendar"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="handleSubmit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const rocketStore = useRocketStore()
const dialog = ref(false)
const formRef = ref()

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

const rules = {
  required: (v: string) => !!v || 'Field ini wajib diisi',
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''
  formRef.value?.resetValidation()
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  rocketStore.addRocket({
    full_name: form.full_name,
    description: form.description || null,
    image_url: form.image_url || null,
    launch_cost: form.launch_cost || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: form.country_code
      ? { id: 0, name: 'Custom', country_code: form.country_code }
      : null,
  })

  resetForm()
  dialog.value = false
}

function handleClose() {
  resetForm()
  dialog.value = false
}
</script>
