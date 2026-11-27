<template>
  <v-card class="card-wrap-subtitle" title="Tambah roket"
    subtitle="Roket disimpan sementara selama aplikasi berjalan dan hilang setelah halaman dimuat ulang.">
    <v-form ref="form" @submit.prevent="submit">
      <v-card-text>
        <v-text-field v-model="draft.name" label="Nama roket *" :rules="[required]" />
        <v-textarea v-model="draft.description" label="Deskripsi *" :rules="[required]" rows="3" />
        <v-text-field v-model="draft.image_url" label="URL gambar (opsional)" :rules="[imageUrlRule]"
          hint="Gunakan URL HTTP atau HTTPS." persistent-hint class="mb-3" />
        <v-combobox v-model="draft.family" :items="families" label="Family (opsional)"
          hint="Pilih family atau ketik family baru." persistent-hint />
        <v-checkbox v-model="draft.active" label="Aktif" hide-details />
        <v-checkbox v-model="draft.reusable" label="Dapat digunakan kembali (reusable)" hide-details />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('cancel')">
          Batal
        </v-btn>
        <v-btn color="primary" variant="flat" type="submit">
          Tambah roket
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

defineProps<{ families: string[] }>()

const emit = defineEmits<{ save: [rocket: NewRocketInput], cancel: [] }>()

const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const draft = reactive<NewRocketInput>({
  name: '', description: '', image_url: '', family: '', active: true, reusable: false,
})

function required(value: string) {
  return !!value?.trim() || 'Field ini wajib diisi.'
}

function imageUrlRule(value: string) {
  if (!value?.trim()) return true

  try {
    return ['http:', 'https:'].includes(new URL(value.trim()).protocol) || 'Gunakan URL HTTP atau HTTPS.'
  } catch {
    return 'URL gambar tidak valid.'
  }
}

async function submit() {
  const result = await form.value?.validate()

  if (result?.valid) emit('save', { ...draft })
}
</script>

<style scoped>
.card-wrap-subtitle :deep(.v-card-subtitle) {
  white-space: normal;
}
</style>