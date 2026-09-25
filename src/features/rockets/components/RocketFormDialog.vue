<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="680"
    scrollable
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center px-6 pt-6">
        <div>
          <div class="text-h5 font-weight-bold">
            Tambah roket
          </div>
          <div class="mt-1 text-body-2 text-medium-emphasis">
            Data hanya tersimpan selama aplikasi berjalan.
          </div>
        </div>
        <v-spacer />
        <v-btn
          aria-label="Tutup"
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>

      <v-card-text class="px-6 pt-5">
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.full_name"
            label="Nama roket"
            :rules="nameRules"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            auto-grow
            label="Deskripsi"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="form.image_url"
            label="URL gambar"
            placeholder="https://example.com/rocket.jpg"
            prepend-inner-icon="mdi-image-outline"
            type="url"
            variant="outlined"
          />

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Biaya peluncuran (USD)"
                min="0"
                prepend-inner-icon="mdi-currency-usd"
                type="number"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                counter="3"
                label="Kode negara"
                maxlength="3"
                placeholder="USA"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="Penerbangan pertama"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          @click="submit"
        >
          Tambahkan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import type { NewRocketInput } from '../types/rocket'

  const dialogOpen = defineModel<boolean>({ required: true })
  const emit = defineEmits<{ submit: [input: NewRocketInput] }>()
  const formRef = ref<VForm | null>(null)

  const emptyForm = (): NewRocketInput => ({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: '',
    maiden_flight: '',
  })

  const form = reactive<NewRocketInput>(emptyForm())
  const nameRules = [
    (value: string) => Boolean(value?.trim()) || 'Nama roket wajib diisi.',
  ]

  function resetForm () {
    Object.assign(form, emptyForm())
    formRef.value?.resetValidation()
  }

  function close () {
    dialogOpen.value = false
    resetForm()
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', { ...form })
    close()
  }
</script>
