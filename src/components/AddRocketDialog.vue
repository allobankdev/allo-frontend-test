<template>
  <v-dialog
    v-model="open"
    max-width="560"
    scrollable
  >
    <v-card title="Tambah rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text class="d-flex flex-column ga-2">
          <v-text-field
            v-model="form.name"
            autofocus
            label="Nama *"
            :rules="rocketFormRules.name"
          />
          <v-textarea
            v-model="form.description"
            auto-grow
            label="Deskripsi"
            rows="3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="URL gambar"
            placeholder="https://..."
            :rules="rocketFormRules.imageUrl"
            type="url"
          />
          <!--
            Sengaja type="text": input number di browser mengosongkan nilai yang tidak valid
            (misalnya 1e400 atau 5e) sehingga lolos validasi sebagai field kosong.
          -->
          <v-text-field
            v-model="form.launchCost"
            inputmode="decimal"
            label="Biaya per peluncuran (USD)"
            :rules="rocketFormRules.launchCost"
          />
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.countryCode"
                label="Kode negara"
                maxlength="3"
                placeholder="USA"
                :rules="rocketFormRules.countryCode"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maidenFlight"
                label="Terbang perdana"
                :rules="rocketFormRules.maidenFlight"
                type="date"
              />
            </v-col>
          </v-row>
          <p class="text-caption text-medium-emphasis">
            * wajib diisi. Field lain boleh dikosongkan.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="open = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  /**
   * Dialog form tambah rocket. Memvalidasi input lalu memancarkan event `submit`
   * berisi data rocket baru; penyimpanan diserahkan ke komponen induk.
   */
  import { ref, watch } from 'vue'
  import type { NewRocketInput } from '@/stores/rocket'
  import { createEmptyRocketForm, rocketFormRules, toNewRocketInput } from '@/utils/rocketForm'

  /** Status buka/tutup dialog (`v-model`). */
  const open = defineModel<boolean>({ required: true })

  const emit = defineEmits<{
    /** Dipicu saat form valid dan pengguna menekan Simpan. */
    submit: [input: NewRocketInput]
  }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
  const form = ref(createEmptyRocketForm())

  // Form selalu kosong setiap kali dialog dibuka.
  watch(open, isOpen => {
    if (isOpen) form.value = createEmptyRocketForm()
  })

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', toNewRocketInput(form.value))
    open.value = false
  }
</script>
