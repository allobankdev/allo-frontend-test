<template>
  <v-dialog v-model="dialog" max-width="600px">
    <!-- Trigger Button untuk Membuka Modal -->
    <template #activator="{ props }">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
        size="large"
        v-bind="props"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="0">
      <!-- Header Modal Dialog -->
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Add New Rocket</span>
        <v-btn icon="mdi-close" variant="text" color="white" @click="dialog = false"></v-btn>
      </v-card-title>

      <!-- Form Input Data Roket -->
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Full Rocket Name *"
            placeholder="e.g. Falcon Heavy Block 5"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="form.name"
            label="Short Name (Optional)"
            placeholder="e.g. Falcon Heavy"
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            label="Description *"
            placeholder="Enter rocket description..."
            variant="outlined"
            rows="3"
            density="compact"
            :rules="[rules.required]"
            class="mb-3"
          ></v-textarea>

          <!-- Input Gambar dari File Lokal -->
          <v-file-input
            v-model="imageFile"
            label="Upload Image from Local File (Optional)"
            placeholder="Choose image from your computer..."
            accept="image/*"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            density="compact"
            clearable
            class="mb-3"
            @change="handleFileChange"
          ></v-file-input>

          <!-- Preview Gambar Lokal yang Diupload (jika ada) -->
          <div v-if="localPreview" class="mb-3 text-center">
            <v-img :src="localPreview" height="150" cover class="bg-grey-lighten-3 mb-1"></v-img>
            <span class="text-caption text-success font-weight-bold">Local Image Selected</span>
          </div>

          <!-- ATAU Input Image URL -->
          <v-text-field
            v-if="!localPreview"
            v-model="form.image_url"
            label="OR Image URL (Optional)"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-row density="compact">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Launch Cost (Optional)"
                placeholder="e.g. $90,000,000"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country_code"
                label="Country Code (Optional)"
                placeholder="e.g. USA"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight / Maiden Flight (Optional)"
            type="date"
            variant="outlined"
            density="compact"
            class="mt-3"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Tombol Batal & Simpan -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Save Rocket
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
const isValid = ref(false)
const formRef = ref<any>(null)

// File lokal upload & Base64 preview
const imageFile = ref<File[] | File | null>(null)
const localPreview = ref<string | null>(null)

// State form lokal
const form = reactive({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

// Rule validasi bidang wajib diisi
const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
}

// Read local file as Base64 Data URL
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target?.files?.[0] || (Array.isArray(imageFile.value) ? imageFile.value[0] : imageFile.value)

  if (file && file instanceof File) {
    const reader = new FileReader()
    reader.onload = (event) => {
      localPreview.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    localPreview.value = null
  }
}

// Handler pengiriman form tambah roket
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Tentukan image URL: Gambar lokal Base64 -> Image URL -> null (No Image Available)
  const finalImageUrl = localPreview.value || form.image_url.trim() || null

  // Panggil action addRocket pada Pinia Store
  rocketStore.addRocket({
    name: form.name.trim() || form.full_name.trim(),
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: finalImageUrl,
    launch_cost: form.launch_cost.trim() || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: form.country_code.trim()
      ? { country_code: form.country_code.trim(), name: 'SpaceX' }
      : { country_code: 'USA', name: 'SpaceX' },
  })

  // Reset isian form & tutup modal
  form.name = ''
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''
  imageFile.value = null
  localPreview.value = null
  dialog.value = false
}
</script>
