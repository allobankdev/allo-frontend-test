<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router/auto'
import { useRocketStore } from '@/store/rocketStore'
import type { IRocket } from '@/types/rocket'

const router = useRouter()
const store = useRocketStore()

const isFormValid = ref(false)

const form = ref({
  name: '',
  description: '',
  cost: 0,
  country: '',
  imageUrl: '',
  firstFlight: '',
})

const rules = {
  required: (value: string) => !!value || 'Kolom ini wajib diisi.',
  number: (value: number) => !isNaN(value) || 'Harus berupa angka.',
  percentage: (value: number) => (value >= 0 && value <= 100) || 'Harus antara 0 - 100.'
}

const submitRocket = () => {
  if (!isFormValid.value) return

  const newRocket: IRocket = {
    id: `custom-${Date.now()}`, 
    name: form.value.name,
    description: form.value.description,
    cost_per_launch: Number(form.value.cost),
    flickr_images: [form.value.imageUrl], 
    country: form.value.country,
    first_flight: form.value.firstFlight,
  }

  store.addRocket(newRocket)
  router.push('/')
}

const cancel = () => {
  router.push('/')
}
</script>

<template>
  <v-container max-width="600">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" @click="cancel" class="mr-4"></v-btn>
      <h1 class="text-h4">Add New Rocket</h1>
    </div>

    <v-form v-model="isFormValid" @submit.prevent="submitRocket">
      <v-card class="pa-4" elevation="2">
        <v-card-text>
          <v-text-field
            v-model="form.name"
            :rules="[rules.required]"
            label="Nama Roket"
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            :rules="[rules.required]"
            label="Deskripsi"
            variant="outlined"
            rows="3"
            class="mb-2"
          ></v-textarea>

          <v-text-field
            v-model="form.imageUrl"
            :rules="[rules.required]"
            label="URL Gambar (Link Image)"
            placeholder="https://example.com/photo.jpg"
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.cost"
                :rules="[rules.required, rules.number]"
                label="Biaya Peluncuran ($)"
                type="number"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.country"
                :rules="[rules.required]"
                label="Negara"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

            <v-text-field
                v-model="form.firstFlight"
                :rules="[rules.required]"
                label="Tanggal Penerbangan Pertama"
                type="date"
                variant="outlined"
              ></v-text-field>

        </v-card-text>

        <v-card-actions class="d-flex justify-end mt-4">
          <v-btn color="grey" variant="text" @click="cancel">Cancel</v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            type="submit" 
            :disabled="!isFormValid"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>