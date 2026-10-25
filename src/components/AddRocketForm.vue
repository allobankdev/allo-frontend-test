<script lang="ts" setup>
  import { reactive} from 'vue'
  import { useRocketStore } from '../stores/rocketStore'

  defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const store = useRocketStore()

  const form = reactive({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: null as number | null,
    country: '',
    maiden_flight: ''
  })

  function submit() {
    store.addLocalRocket({
      full_name: form.full_name,
      description: form.description,
      image_url: form.image_url,
      launch_cost: form.launch_cost,
      country: form.country,
      maiden_flight: form.maiden_flight
    })

    Object.assign(form, {
      full_name: '',
      description: '',
      image_url: '',
      launch_cost: null,
      country: '',
      maiden_flight: ''
    })

    emit('update:modelValue', false)
  }
</script>

<template>
  <v-dialog
    max-width="600"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Tambah Roket Baru</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Nama Roket"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Deskripsi"
          />
          <v-text-field
            v-model="form.image_url"
            label="URL Gambar"
          />
          <v-text-field
            v-model.number="form.launch_cost"
            label="Biaya per Peluncuran (USD)"
            type="number"
          />
          <v-text-field
            v-model="form.country"
            label="Negara"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="Penerbangan Perdana"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          @click="submit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
