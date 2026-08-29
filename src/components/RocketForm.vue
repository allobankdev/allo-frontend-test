<template>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Tambah Rocket</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="form.name"
              label="Nama Rocket"
              required
            />
            <v-textarea
              v-model="form.description"
              label="Deskripsi"
              rows="3"
              required
            />
            <v-text-field
              v-model="form.image"
              label="URL Gambar"
              placeholder="https://..."
            />
            <v-text-field
              v-model="form.cost_per_launch"
              label="Biaya Per Peluncuran"
              @input="formatCost"
            />
            <v-text-field
              v-model="form.country"
              label="Negara"
            />
  
            <!-- Date Picker -->
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="form.first_flight"
                  label="Penerbangan Pertama"
                  readonly
                  placeholder="Pilih tanggal"
                />
              </template>
              <v-date-picker
                v-model="datePicker"
                @update:model-value="onDateSelect"
                locale="id"
              />
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Batal</v-btn>
          <v-btn color="primary" @click="submitForm">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  const props = defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', rocket: any): void
  }>()
  
  const dialog = ref(props.modelValue)
  watch(() => props.modelValue, val => (dialog.value = val))
  watch(dialog, val => emit('update:modelValue', val))
  
  const formRef = ref()
  const form = ref({
    name: '',
    description: '',
    image: '',
    cost_per_launch: '',
    country: '',
    first_flight: '',
  })
  const menu = ref(false)
  const datePicker = ref('')
  
  function closeDialog() {
    dialog.value = false
    resetForm()
  }
  
  function resetForm() {
    form.value = {
      name: '',
      description: '',
      image: '',
      cost_per_launch: '',
      country: '',
      first_flight: '',
    }
    datePicker.value = ''
  }
  
  // Format input cost
  function formatCost() {
    let num = form.value.cost_per_launch.replace(/\D/g, '')
    form.value.cost_per_launch = num ? num.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
  }
  
  // Pilih tanggal
  function onDateSelect(val: string | Date) {
    if (!val) return
  
    let year: string, month: string, day: string
  
    if (typeof val === 'string') {
      [year, month, day] = val.split('-')
    } else if (val instanceof Date) {
      year = val.getFullYear().toString()
      month = (val.getMonth() + 1).toString().padStart(2, '0')
      day = val.getDate().toString().padStart(2, '0')
    } else return
  
    form.value.first_flight = `${year}-${month}-${day}`
    datePicker.value = `${year}-${month}-${day}`
    menu.value = false
  }
  
  // Submit rocket baru
  function submitForm() {
    if (!form.value.name || !form.value.description) return
  
    const rocket = {
      id: `local-${Date.now()}`,
      name: form.value.name,
      description: form.value.description,
      flickr_images: [form.value.image || 'https://via.placeholder.com/400'],
      cost_per_launch: form.value.cost_per_launch || '-',
      country: form.value.country || '-',
      first_flight: form.value.first_flight || '-',
      isApi: false,
    }
  
    emit('submit', rocket)
    closeDialog()
  }
  </script>  