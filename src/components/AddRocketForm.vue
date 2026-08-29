<template>
  <v-card variant="tonal">
    <v-card-title class="text-h6">
      Tambah Rocket
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="form.name"
              label="Nama Rocket"
              required
              :disabled="props.disabled"
              :error-messages="errors.name"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="form.image"
              label="URL Gambar"
              placeholder="https://..."
              :disabled="props.disabled"
              :error-messages="errors.image"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Deskripsi"
              rows="3"
              required
              :disabled="props.disabled"
              :error-messages="errors.description"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="form.costPerLaunch"
              label="Cost Per Launch"
              type="number"
              min="0"
              :disabled="props.disabled"
              :error-messages="errors.costPerLaunch"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="form.country"
              label="Country"
              :disabled="props.disabled"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="form.firstFlight"
              label="First Flight"
              placeholder="YYYY-MM-DD"
              :disabled="props.disabled"
              :error-messages="errors.firstFlight"
            />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          type="submit"
          :loading="props.disabled"
          :disabled="props.disabled"
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

  interface Props {
    disabled?: boolean
  }

  interface Emits {
    (event: 'submit', payload: CreateRocketPayload): void
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
  })

  const emit = defineEmits<Emits>()

  const form = reactive<CreateRocketPayload>({
    name: '',
    description: '',
    image: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
  })

  const errors = reactive<Record<string, string[]>>({
    name: [],
    description: [],
    image: [],
    costPerLaunch: [],
    firstFlight: [],
  })

  function resetForm() {
    form.name = ''
    form.description = ''
    form.image = ''
    form.costPerLaunch = 0
    form.country = ''
    form.firstFlight = ''
    clearErrors()
  }

  function clearErrors() {
    errors.name = []
    errors.description = []
    errors.image = []
    errors.costPerLaunch = []
    errors.firstFlight = []
  }

  function onSubmit() {
    clearErrors()
    const isValid = validateForm()
    if (!isValid) return

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

  function validateForm() {
    let valid = true

    if (!form.name?.trim()) {
      errors.name = ['Nama rocket wajib diisi.']
      valid = false
    }

    if (!form.description?.trim()) {
      errors.description = ['Deskripsi rocket wajib diisi.']
      valid = false
    }

    if (form.image?.trim() && !isValidUrl(form.image.trim())) {
      errors.image = ['URL gambar tidak valid. Gunakan format http:// atau https://']
      valid = false
    }

    const cost = Number(form.costPerLaunch)
    if (!Number.isFinite(cost) || cost < 0) {
      errors.costPerLaunch = ['Cost Per Launch harus angka nol atau lebih besar.']
      valid = false
    }

    if (form.firstFlight?.trim() && !isValidDateFormat(form.firstFlight.trim())) {
      errors.firstFlight = ['Format tanggal harus YYYY-MM-DD dan tanggal valid.']
      valid = false
    }

    return valid
  }

  function isValidUrl(value: string) {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  function isValidDateFormat(value: string) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(value)) return false

    const parsed = new Date(`${value}T00:00:00Z`)
    if (Number.isNaN(parsed.getTime())) return false

    return parsed.toISOString().startsWith(value)
  }
</script>

