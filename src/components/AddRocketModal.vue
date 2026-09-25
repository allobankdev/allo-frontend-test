<template>
  <v-dialog
    v-model="isOpen"
    max-width="800px"
    persistent
    scrim="rgba(0, 0, 0, 1.0)"
  >
    <v-card
      theme="light"
      color="white"
      rounded="sm"
    >
      <v-card-title class="text-h5 pt-8 px-8 font-weight-bold">
        Tambah Roket Baru
      </v-card-title>

      <v-card-text class="px-8 mt-4">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="submitRocket"
        >
          <v-text-field
            v-model="formData.full_name"
            label="Nama Roket *"
            :rules="[(v) => !!v || 'Nama roket wajib diisi']"
            variant="outlined"
            class="mb-2"
            required
          />

          <v-textarea
            v-model="formData.description"
            label="Deskripsi"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="formData.image_url"
            label="URL Gambar"
            placeholder="https://contoh.com/gambar.jpg"
            variant="outlined"
            class="mb-2"
          />

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.launch_cost"
                label="Biaya Peluncuran $"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.maiden_flight"
                label="Tanggal Peluncuran"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.country_code"
            label="Kode Negara (contoh: USA, INA)"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-8 pb-8 pt-0">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          size="large"
          @click="closeModal"
        >
          Batal
        </v-btn>
        <v-btn
          color="black"
          variant="flat"
          size="large"
          class="px-6 ml-4"
          :disabled="!isFormValid"
          @click="submitRocket"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRocketStore } from "../stores/rocketStore";
import type { Rocket } from "../types/rocket";

const isOpen = defineModel<boolean>();

const rocketStore = useRocketStore();
const isFormValid = ref(false);
const formRef = ref();

const formData = reactive({
  full_name: "",
  description: "",
  image_url: "",
  launch_cost: "",
  maiden_flight: "",
  country_code: "",
});

const resetForm = () => {
  if (formRef.value) formRef.value.reset();
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const submitRocket = () => {
  if (!isFormValid.value) return;

  const newRocket: Rocket = {
    id: Date.now(),
    full_name: formData.full_name,
    description: formData.description || null,
    image_url: formData.image_url || null,
    launch_cost: formData.launch_cost || null,
    maiden_flight: formData.maiden_flight || null,
    manufacturer: {
      id: Date.now(),
      name: "Custom Manufacturer",
      country_code: formData.country_code || null,
    },
  };

  rocketStore.addLocalRocket(newRocket);

  closeModal();
};
</script>
