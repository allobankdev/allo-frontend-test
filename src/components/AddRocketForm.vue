<template>
  <v-card variant="tonal">
    <v-card-title class="text-h6">Tambah Rocket</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              label="Nama Rocket"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.image"
              label="URL Gambar"
              placeholder="https://..."
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Deskripsi"
              rows="3"
              required
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form.costPerLaunch"
              label="Cost Per Launch"
              type="number"
              min="0"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.country"
              label="Country"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.firstFlight"
              label="First Flight"
              placeholder="YYYY-MM-DD"
            />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          type="submit"
        >
          Tambah
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import type { CreateRocketPayload } from '@/store/rocketStore'

  interface Emits {
    (event: 'submit', payload: CreateRocketPayload): void
  }

  const emit = defineEmits<Emits>()

  const form = reactive<CreateRocketPayload>({
    name: '',
    description: '',
    image: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
  })

  function resetForm() {
    form.name = ''
    form.description = ''
    form.image = ''
    form.costPerLaunch = 0
    form.country = ''
    form.firstFlight = ''
  }

  function onSubmit() {
    if (!form.name.trim() || !form.description.trim()) return

    emit('submit', {
      name: form.name,
      description: form.description,
      image: form.image,
      costPerLaunch: Number(form.costPerLaunch) || 0,
      country: form.country,
      firstFlight: form.firstFlight,
    })

    resetForm()
  }
</script>
