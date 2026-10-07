<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { NewRocket } from '../types/rocket'

const emit = defineEmits<{ add: [rocket: NewRocket]; cancel: [] }>()
const nameInput = ref<HTMLInputElement | null>(null)
const form = reactive({ name: '', description: '', imageUrl: '', launchCost: '', country: '', firstFlight: '' })
const error = ref('')
onMounted(() => nameInput.value?.focus())

function submit() {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'Nama roket wajib diisi.'
    nameInput.value?.focus()
    return
  }
  const cost = String(form.launchCost).trim()
  if (cost && (!Number.isFinite(Number(cost)) || Number(cost) < 0)) {
    error.value = 'Biaya peluncuran harus berupa angka nol atau lebih.'
    return
  }
  const image = form.imageUrl.trim()
  if (image) {
    try {
      if (!['http:', 'https:'].includes(new URL(image).protocol)) throw new Error()
    } catch {
      error.value = 'Gunakan alamat gambar yang dimulai dengan https:// atau http://.'
      return
    }
  }
  emit('add', {
    name: form.name.trim(),
    description: form.description.trim(),
    imageUrl: image || null,
    launchCost: cost || null,
    country: form.country.trim() || null,
    firstFlight: form.firstFlight || null,
  })
}
</script>

<template>
  <section class="form-panel" aria-labelledby="add-title">
    <h2 id="add-title">Tambah roket</h2>
    <p id="form-note" class="muted">Nama wajib diisi. Data tambahan tersimpan selama aplikasi berjalan dan hilang saat halaman dimuat ulang.</p>
    <form aria-describedby="form-note" @submit.prevent="submit">
      <div class="form-grid">
        <label class="field field-wide">
          <span>Nama roket <span aria-hidden="true">*</span></span>
          <input ref="nameInput" v-model="form.name" name="name" required>
        </label>
        <label class="field field-wide">
          <span>Deskripsi</span>
          <textarea v-model="form.description" name="description" rows="3" />
        </label>
        <label class="field field-wide">
          <span>Alamat gambar</span>
          <input v-model="form.imageUrl" name="imageUrl" type="url" placeholder="https://…">
        </label>
        <label class="field">
          <span>Biaya per peluncuran (USD)</span>
          <input v-model="form.launchCost" name="launchCost" type="number" min="0" step="any">
        </label>
        <label class="field">
          <span>Negara</span>
          <input v-model="form.country" name="country">
        </label>
        <label class="field">
          <span>Penerbangan pertama</span>
          <input v-model="form.firstFlight" name="firstFlight" type="date">
        </label>
      </div>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="actions">
        <button class="button" type="submit">Simpan roket</button>
        <button class="button button-secondary" type="button" @click="emit('cancel')">Batal</button>
      </div>
    </form>
  </section>
</template>
