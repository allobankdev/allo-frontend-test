<template>
  <v-btn
    color="primary"
    prepend-icon="mdi-plus"
    @click="open = true"
  >
    Add Rocket
  </v-btn>

  <v-dialog
    v-model="open"
    max-width="560"
  >
    <v-card title="Tambah Rocket">
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            label="Nama rocket *"
            :rules="[rules.required]"
          />
          <v-textarea
            v-model="form.description"
            label="Deskripsi"
            rows="3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="URL gambar"
            :rules="[rules.url]"
          />
          <v-text-field
            v-model="form.cost"
            label="Cost per launch (USD)"
            :rules="[rules.cost]"
            type="number"
          />
          <v-text-field
            v-model="form.country"
            label="Country code (mis. USA)"
            maxlength="3"
          />
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import { useRocketStore } from '@/stores/rocketStore'

  const store = useRocketStore()
  const open = ref(false)
  const formRef = ref<VForm | null>(null)

  const emptyForm = () => ({
    name: '',
    description: '',
    imageUrl: '',
    cost: '',
    country: '',
    firstFlight: '',
  })
  const form = reactive(emptyForm())

  const isValidUrl = (value: string) => {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
      return false
    }
  }

  const rules = {
    required: (v: string) => !!v?.trim() || 'Nama wajib diisi',
    url: (v: string) => !v || isValidUrl(v) || 'URL tidak valid',
    cost: (v: string) => !v || Number(v) >= 0 || 'Cost tidak boleh negatif',
  }

  function close () {
    open.value = false
    Object.assign(form, emptyForm())
    formRef.value?.resetValidation()
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    // field opsional yang kosong disimpan sebagai null -> ditangani fallback di UI
    store.addRocket({
      full_name: form.name.trim(),
      description: form.description.trim() || null,
      image_url: form.imageUrl.trim() || null,
      launch_cost: form.cost || null,
      maiden_flight: form.firstFlight || null,
      manufacturer: { country_code: form.country.trim().toUpperCase() || null },
    })
    close()
  }
</script>