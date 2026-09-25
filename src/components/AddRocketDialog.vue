<template>
  <v-dialog
    v-model="isOpen"
    max-width="560"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
      >
        Tambah Roket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Tambah Roket Baru</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="compact"
          @click="isOpen = false"
        />
      </v-card-title>

      <v-form @submit.prevent="handleSubmit">
        <v-card-text class="pt-4">
          <v-text-field
            v-model="form.full_name"
            label="Nama Roket *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Nama roket wajib diisi ya']"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Deskripsi"
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="URL Gambar"
            placeholder="https://contoh.com/roket.jpg"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Biaya Peluncuran ($)"
                placeholder="misal 50000000"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Kode Negara"
                placeholder="misal USA, IDN"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="Tanggal Terbang Perdana"
            type="date"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="isOpen = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            type="submit"
            :disabled="!form.full_name.trim()"
          >
            Simpan Roket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { Rocket } from '@/types/rocket'

const emit = defineEmits<{
  (e: 'add', rocket: Rocket): void
}>()

const isOpen = ref(false)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

const resetForm = () => {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''
}

const handleSubmit = () => {
  if (!form.full_name.trim()) return

  const newRocket: Rocket = {
    id: `local-${Date.now()}`,
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost.trim() || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      name: 'Custom',
      country_code: form.country_code.trim().toUpperCase() || 'N/A',
    },
  }

  emit('add', newRocket)
  resetForm()
  isOpen.value = false
}
</script>
