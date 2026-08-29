<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

const dialog = ref(false)
const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  country: '',
  cost_per_launch: null as number | null,
  first_flight: '',
})

const errors = reactive({
  name: '',
  description: '',
})

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Nama roket wajib diisi'
  errors.description = form.description.trim() ? '' : 'Deskripsi wajib diisi'
  return !errors.name && !errors.description
}

async function submit() {
  if (!validate()) return

  loading.value = true
  await new Promise(r => setTimeout(r, 400))

  store.addLocalRocket({
    name: form.name.trim(),
    description: form.description.trim(),
    country: form.country.trim() || undefined,
    cost_per_launch: form.cost_per_launch ?? undefined,
    first_flight: form.first_flight || undefined,
    flickr_images: [],
    active: true,
  })

  loading.value = false
  dialog.value = false
  resetForm()
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.country = ''
  form.cost_per_launch = null
  form.first_flight = ''
  errors.name = ''
  errors.description = ''
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="520">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Tambah Roket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="pt-5 px-6">
        <v-icon icon="mdi-rocket-launch" class="mr-2" />
        Tambah Roket Baru
      </v-card-title>

      <v-card-text class="px-6">
        <v-text-field
          v-model="form.name"
          label="Nama Roket *"
          variant="outlined"
          density="comfortable"
          :error-messages="errors.name"
          class="mb-2"
        />
        <v-textarea
          v-model="form.description"
          label="Deskripsi *"
          variant="outlined"
          density="comfortable"
          rows="3"
          :error-messages="errors.description"
          class="mb-2"
        />
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="form.country"
              label="Negara"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.cost_per_launch"
              label="Biaya Peluncuran ($)"
              variant="outlined"
              density="comfortable"
              type="number"
              min="0"
              hide-details
              @keypress="(e: KeyboardEvent) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="form.first_flight"
          label="Penerbangan Pertama"
          variant="outlined"
          density="comfortable"
          type="date"
          hide-details
          class="mt-2"
        />
      </v-card-text>

      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false; resetForm()">Batal</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          @click="submit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
